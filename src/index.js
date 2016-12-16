import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Base } from './components/Panel';
import { EventEmitter } from 'events';
import { addListener, ajax, skipOver, getCookie, serialize, codeTrigger } from './util';

const _event = new EventEmitter();
const el_main = document.querySelector( '#panel-main' );
const el_register = document.querySelector( '#panel-register' );
const el_resettlement = document.querySelector( '#panel-resettlement' );

const webRoot = window.webRoot;
const swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    effect: 'cube',
    grabCursor: true,
    initialSlide: 1,
    cube: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94
    },
    onTouchEnd: ( swiper ) => {
        //该回调事件在 swiper 的实际触发, 在 slideChanged 之后
        //而 realIndex 赋值在 slideChanged 的回调中
        //故需将该回调在 线程中后置
        setTimeout( () => {
            
            if( swiper.realIndex == 0 ){

                _event.emit( 'show_item.register' );
            }else{

                _event.emit( 'hide_item.register' );
            }
        }, 0 );
    },
    onInit: ( swiper ) => {

        //因value的填充取决于其他js，相对组件为异步，尝试从cookie取值
        let account = el_main.querySelector( 'input[name="account"]' ).value 
            || ( atob( getCookie( 'resu' ) ) && atob( getCookie( 'resu' ) ).split( ',' )[ 0 ] );

        // 为 原登录兼容 
        // 1，在输入框区域的拖拽 取消对swiper滚动的影响
        ;[].map.call( document.querySelectorAll( '#panel-main input' ), ( v, i, a ) => {

            addListener( 'mouseenter', v, ( event ) => {

                swiper.lockSwipeToNext();
                v.select();
            } );

            addListener( 'mouseleave', v, ( event ) => {

                swiper.unlockSwipeToNext();
            } );
        } );

        //2, 为按钮绑定跳转
        addListener( 'click', document.querySelector( '#to_register' ), function (e){

            swiper.slidePrev();
        } );
        addListener( 'click', document.querySelector( '#to_resettlement' ), function (e){

            swiper.slideNext();
        } );

        /**
        * @generator 注册 重置 
        * @description 传递isRegister作为渲染区分标志
        * @return {ReactClass} 父类
        **/ 
        const factory = function* (){

            for( let i = 0; true; i++ )
                yield Base( class extends Component {

                    static defaultProps = {
                        
                        isRegister: !i,
                        account: account
                    }

                    static propTypes = {

                        isRegister: React.PropTypes.bool.isRequired,
                        account: React.PropTypes.string
                    }

                    render (){

                        return(
                            <div></div>
                        )
                    }
                },
                { _event: _event, swiper: swiper } );
        }
        const product = factory();
        const Reg = product.next().value;
        const Res = product.next().value;

        render( <Reg />, el_register );
        render( <Res />, el_resettlement );
    }
});

/**
* @description _event listener
* @param {string} like name.host
* @param {HTMLElement} el
* @param {Unknow} from emit
*/
//发送邮箱验证码
_event.on( 'send_mail.register', ( code, el ) => {
    
    if( el.hasAttribute('disabled') ){

        return void 0;
    }else if( !code ){

        $.tips( 'warning.close', { title: '失败', body: '邮箱不能为空！' }, 3 );
    }else if( !code.match( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/gi ) ){

        $.tips( 'warning.close', { title: '失败', body: '邮箱地址不正确！' }, 3 );
    }else{

        codeTrigger( el, '获取邮箱验证码' );
        ajax( {
            type: 'post',
            url: webRoot + 'Register/MailVerifCode?' + '_=' + +new Date(),
            data: { mailAddress: code },
            success: ( result ) => {

                const data = JSON.parse( result );
                if( data.Status == 0 ){

                    $.tips( 'success.close', { title: '成功', body: data.Message }, 3 );

                }else{

                    $.tips( 'warning.close', { title: '失败', body: data.Message }, 3 );
                }
            },
            error: ( error ) => {

                $.tips( 'warning.close', { title: '失败', body: error }, 3 );
            }

        } );
    }
} );

//保存邮箱地址
let mailAddress = '';
//申请注册 下一步
_event.on( 'to_next.register', ( resolve, domArr, param, el ) => {

    const params = serialize( param );

    if( params.split( '&' ).length !== 6 ){

        $.tips( 'warning.close', { title: '失败', body: '不能为空！' }, 3 );
        resolve( 'fail => 下一步 => 本地验证' );
        return void 0;
    }else{

        ajax( {
            type: 'post',
            url: webRoot + 'Register/VerifyRegInfo?' + '_=' + +new Date(),
            data: param,
            success: ( result ) => {

                const data = JSON.parse( result );
                if( data.Status == 0 ){

                    mailAddress = param.Email;
                    $.tips( 'success.close', { title: '成功', body: '请填写手机验证码完成申请！' }, 3 );
                    domArr[ 0 ].style.display = 'none';
                    domArr[ 1 ].style.display = 'block';
                }else{

                    $.tips( 'warning.close', { title: '失败', body: data.Message }, 3 );
                }
                resolve( 'done' );
            },
            error: ( error ) => {

                $.tips( 'warning.close', { title: '失败', body: error }, 3 );
                resolve( 'fail => 下一步 => 连接错误' );
            }

        } );
    }
} );

//发送手机验证码
_event.on( 'send_phone.register', ( code, el ) => {

    if( el.hasAttribute('disabled') ){

        return void 0;
    }else if( !code ){

        $.tips( 'warning.close', { title: '失败', body: '手机号码不能为空！' }, 3 );
        return void 0;
    } else {

        codeTrigger( el, '获取手机验证码' );
        ajax( {
            type: 'post',
            url: webRoot + 'Register/MsgVerifCode?' + '_=' + +new Date(),
            data: {
                mailAddress: mailAddress,
                phoneNumber: code.trim()
            },
            success: ( result ) => {

                const data = JSON.parse( result );
                if( data.Status == 0 ){

                    $.tips( 'success.close', { title: '成功', body: '验证码已发送！' }, 3 );

                }else{

                    $.tips( 'warning.close', { title: '失败', body: data.Message }, 3 );
                }
            },
            error: ( error ) => {

                $.tips( 'warning.close', { title: '失败', body: error }, 3 );
            }

        } );
    }
} );

//申请注册
_event.on( 'submit.register', ( resolve, param ) => {

    const params = serialize( param );
    if( params.split( '&' ).length !== 2 ){

        $.tips( 'warning.close', { title: '失败', body: '不能为空！' }, 3 );
        resolve( 'fail => 申请注册 => 本地验证' );
        return void 0;
    }else{

        param.mailAddress = mailAddress;

        ajax( {
            type: 'post',
            url: webRoot + 'Register/Register?' + '_=' + +new Date(),
            data: param,
            success: ( result ) => {

                const data = JSON.parse( result );
                if( data.Status == 0 ){

                   $.tips( 'success.close', { title: '成功', body: '已成功提交申请！' }, 3 );
                   swiper.slideNext();
                }else{

                    $.tips( 'warning.close', { title: '失败', body: data.Message }, 3 );
                }
                resolve( 'done' );
            },
            error: ( error ) => {

                $.tips( 'warning.close', { title: '失败', body: error }, 3 );
                resolve( 'fail => 申请注册 => 连接错误' );
            }

        } );
    }
} );

//发送重置邮件
_event.on( 'send_mail.resettlement', ( param, el ) => {
    
    if( el.hasAttribute('disabled') ){

        return void 0;
    }else if( !param[ 'account' ] || !param[ 'address' ] ){

        $.tips( 'warning.close', { title: '失败', body: '邮箱/手机号码不能为空！' }, 3 );
        return void 0;
    } else if( !param[ 'address' ].search( '@' ) && param[ 'address' ].march( /\d{7,}/gi ) ) {

        $.tips( 'warning.close', { title: '失败', body: '邮箱/手机号码格式不正确！' }, 3 );
        return void 0;
    } else {

        let url = '';
        let verifType = false;
        if( param[ 'address' ].match( /\d{7,}/gi ) )
            verifType = true;

        if( verifType ){
            url = webRoot + 'ResetPwd/MsgVerifCode?' + '_=' + +new Date();
            param = {  
                account: param.account,
                phoneNumber: param.address
            }
        }else{
            url = webRoot + 'ResetPwd/MailVerifCode?' + '_=' + +new Date();
            param = {  
                account: param.account,
                mailAddress: param.address
            }
        }


        codeTrigger( el );
        ajax( {
            type: 'post',
            url: url,
            data: param,
            success: ( result ) => {

                const data = JSON.parse( result );
                if( data.Status == 0 ){

                    $.tips( 'success.close', { title: '成功', body: '验证码已发送！' }, 3 );

                }else{

                    $.tips( 'warning.close', { title: '失败', body: data.Message }, 3 );
                }
            },
            error: ( error ) => {

                $.tips( 'warning.close', { title: '失败', body: error }, 3 );
            }

        } );
    }
} );

//确认重置
_event.on( 'to_reset.resettlement', ( resolve, param ) => {
    
    const params = serialize( param );
    if( params.split( '&' ).length !== 4 ){

        $.tips( 'warning.close', { title: '失败', body: '不能为空！' }, 3 );
        resolve( 'fail => 确认重置 => 本地验证' );
        return void 0;
    }else{

        ajax( {
            type: 'post',
            url: webRoot + 'ResetPwd/ResetPwd?' + '_=' + +new Date(),
            data: param,
            success: ( result ) => {

                const data = JSON.parse( result );
                if( data.Status == 0 ){

                   $.tips( 'success.close', { title: '成功', body: data.Message }, 3 );
                   swiper.slidePrev();
                }else{

                    $.tips( 'warning.close', { title: '失败', body: data.Message }, 3 );
                }
                resolve( 'done => 确认重置 => 连接成功' );
            },
            error: ( error ) => {

                $.tips( 'warning.close', { title: '失败', body: error }, 3 );
                resolve( 'done => 确认重置 => 连接错误' );
            }

        } );
    }
} );

export { _event };