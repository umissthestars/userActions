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

        ajax( {
            type: 'get',
            url: webRoot + 'Auth/MailVerifCode?' + 'mailAddress=' + code.trim() + '&_=' + +new Date(),
            success: ( data ) => {

                if( data.Status == 0 ){

                    codeTrigger( el );
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

//保存邮箱地址
let mailAddress = '';
//申请注册 下一步
_event.on( 'to_next.register', ( domArr, param ) => {

    const params = serialize( param );

    if( params.split( '&' ).length !== 7 ){

        $.tips( 'warning.close', { title: '失败', body: '不能为空！' }, 3 );
        return void 0;
    }else{

        ajax( {
            type: 'get',
            url: webRoot + 'Auth/VerifyRegInfo?' + params + '&_=' + +new Date(),
            success: ( data ) => {

                if( data.Status == 0 ){

                    mailAddress = param.email;
                    $.tips( 'success.close', { title: '成功', body: '请填写手机验证码完成申请！' }, 3 );
                    domArr[ 0 ].style.display = 'none';
                    domArr[ 1 ].style.display = 'block';

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

//发送手机验证码
_event.on( 'send_phone.register', ( code, el ) => {
    
    if( el.hasAttribute('disabled') ){

        return void 0;
    }else if( !code ){

        $.tips( 'warning.close', { title: '失败', body: '手机号码不能为空！' }, 3 );
        return void 0;
    } else {

        ajax( {
            type: 'get',
            url: webRoot + 'Auth/MsgVerifCode?' + 'mailAddress=' + mailAddress + '&phoneNumber=' + code.trim() + '&_=' + +new Date(),
            success: ( data ) => {

                if( data.Status == 0 ){

                    codeTrigger( el );
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
_event.on( 'submit.register', ( code ) => {

    const params = serialize( code );
    if( params.split( '&' ).length !== 2 ){

        $.tips( 'warning.close', { title: '失败', body: '不能为空！' }, 3 );
        return void 0;
    }else{

        ajax( {
            type: 'get',
            url: webRoot + 'Auth/Register?' + params + '&mailAddress=' + mailAddress + '&_=' + +new Date(),
            success: ( data ) => {

                if( data.Status == 0 ){

                   $.tips( 'success.close', { title: '成功', body: '已成功提交申请！' }, 3 );
                   swiper.slideNext();
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

//发送重置邮件
_event.on( 'send_mail.resettlement', ( param, el ) => {
    
    if( el.hasAttribute('disabled') ){

        return void 0;
    }else if( !param[ "account" ] || !param[ "send" ] ){

        $.tips( 'warning.close', { title: '失败', body: '邮箱/手机号码不能为空！' }, 3 );
        return void 0;
    } else {

        ajax( {
            type: 'get',
            url: webRoot + 'Auth/MsgVerifCode?' + 'account=' + param[ "account" ].trim() + '&phoneNumber=' + param[ "send" ].trim() + '&_=' + +new Date(),
            success: ( data ) => {

                if( data.Status == 0 ){

                    codeTrigger( el );
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
_event.on( 'to_reset.resettlement', ( param ) => {
    
    const params = serialize( param );
    if( params.split( '&' ).length !== 3 ){

        $.tips( 'warning.close', { title: '失败', body: '不能为空！' }, 3 );
        return void 0;
    }else{

        ajax( {
            type: 'get',
            url: webRoot + 'Auth/Register?' + params + '&_=' + +new Date(),
            success: ( data ) => {

                if( data.Status == 0 ){

                   $.tips( 'success.close', { title: '成功', body: '已成功提交申请！' }, 3 );
                   swiper.slidePrev();
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

export { _event };