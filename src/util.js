const addListener = ( type = 'click', target, func, bubble = false ) => {
    
    const types = type.split( ',' );
    types.map( ( v, i, a ) => {
        v = v.trim();
        if( target.addEventListener )  
                target.addEventListener( v, func, bubble );  
        else if( target.attachEvent )
            target.attachEvent( "on" + v, func );  
        else target[ "on" + v ] = func;  
    } );
}

const removeListener = ( type = 'click', target, func, bubble = false ) => {

    const types = type.split( ',' );
    types.map( ( v, i, a ) => {
        v = v.trim();
        if( target.removeEventListener )  
                target.removeEventListener( v, func, bubble );  
        else if( target.detachEvent )
            target.detachEvent( "on" + v, func );  
        else target[ "on" + v ] = null;  
    } );
}

/**
* @description xhq
* @param {Object} = {}
*   0, {String} type = 'get'
*   1, {String} url
*   2, {Object} data = {}
*   3, {Function} success
*   4, {Function} error
* @return {XMLHttpRequestInstance} XMLHttpReq
*/
const ajax = ( { type = 'get', url, data = {}, success, error } = {} ) => {

    let XMLHttpReq;  
    type = type.toLowerCase();

    try {  
        XMLHttpReq = new ActiveXObject( "Msxml2.XMLHTTP" );//IE高版本创建XMLHTTP  
    }  
    catch( error ) {  
        try {  
            XMLHttpReq = new ActiveXObject( "Microsoft.XMLHTTP" );//IE低版本创建XMLHTTP  
        }  
        catch( error ) {  
            XMLHttpReq = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象  
        }  
    }  
    if( type === 'get' )
        XMLHttpReq.open( type, url, true );
    else{

        XMLHttpReq.open( type, url, true );
        XMLHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }

    XMLHttpReq.onreadystatechange = () => {  
        if ( XMLHttpReq.readyState == 4 ) {  
            if ( XMLHttpReq.status == 200 ) {

                success && success( XMLHttpReq.responseText, this );
            }else{

                error && error( XMLHttpReq.statusText );
            }
        }  
    }   
    XMLHttpReq.send( type === 'get' ? null : serialize( data ) );

    return XMLHttpReq;
}

/**
* @description 略过样式
* @param {HTMLElement} dom 宿主
* @param {Number} interval 清除循环
* @return {Number} interval 循环句柄
*/
const skipOver = ( dom, interval ) => {

    if( interval )
        window.clearInterval( interval );
    
    if( dom.nodeType !== 1 )
        return void 0;

    let i = 0;
    const cssSkip = [ '-webkit-mask-image: -webkit-gradient(radial, 0 200, ', ', 0 0, ', ', from(rgb(0, 0, 0)), color-stop(0.4, rgba(255, 255, 255, 0.9)), to(rgb(0, 0, 0)));' ];
    interval = window.setInterval(function(){

        if( i >= 400 )
            window.clearInterval( interval );

        i += 8;

        const styles = dom.getAttribute('style');
        dom.setAttribute( 'style', cssSkip[ 0 ] + ( i - 15 ) + cssSkip[ 1 ] + i + cssSkip[ 2 ] + ';' + styles );
        
    }, 15);

    return interval;
}

/**
* @description cookie
*/
const setCookie = ( name, value, days = 7 ) => {
    days = value ? days : -1 ; // it means delete this cookie if the param hasn't value
    const exp = new Date();
    exp.setTime( exp.getTime() + days*24*60*60*1000 );
    document.cookie = name + "="+ escape( value ) + ";expires=" + exp.toGMTString();
}

const getCookie = ( name ) => {
    if( !name )
        return '';
    let arr;
    const reg = new RegExp( "(^| )" + name + "=([^;]*)(;|$)" );
    if( arr = document.cookie.match( reg ) )
        return unescape( arr[2] );
    else
        return null;
}

/**
* @description serialize object to param
* @param {Object} data
* @return {String} param
*/

const serialize = ( data ) => {

    let param = '';
    for( let i in data )
        if( data.hasOwnProperty( i ) )
            if( toString.call( data[ i ] ) === '[object Array]' )
                data[ i ].map( v => data[ i ][ v ].trim() && ( param += '&' + i + '=' + data[ i ][ v ].trim() ) );
            else
                data[ i ].trim() && ( param += '&' + i + '=' + data[ i ].trim() );  

    return param.substr( 1 );
}

const codeTrigger = ( el, resetText = '获取验证码', sustainText ) => {

    el.setAttribute( 'disabled', '' );
    
    function* interval(){

        let time = 60;
        while( time > 0 )
            if( sustainText )
                yield ( sustainText );
            else
                yield ( time-- + 's后重新获取' );
    }
    
    const _interval = interval();
    let isInterval = setInterval( () => {

        let val = _interval.next().value;
        if( val )
            el.innerHTML = val;
        else{

            clearInterval( isInterval );
            el.removeAttribute( 'disabled' );
            el.innerHTML = resetText;
        }
            
    } , 1 * 1000 );
}

export { addListener, removeListener, ajax, skipOver, setCookie, getCookie, serialize, codeTrigger };