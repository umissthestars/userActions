import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { next } from '../style/main.css';

export default class Next extends Component {

	static contextTypes = {

		_event: React.PropTypes.object
	}

	constructor( props ) {
		
		super( props );

		//发送手机验证码
		this.sendPhoneCode = code => this.context._event.emit( 'send_phone.register', code, ReactDOM.findDOMNode( this.refs.getPhoneCode ) );

		//申请注册
		this.toRegister = ( phone, code ) => this.context._event.emit( 'submit.register', {
			phoneNumber: this.refs.phoneInput.value,
			msgVerifCode: this.refs.phoneCodeInput.value
		} );
	}

	render (){

		return (
			<div>
			    <div className= "form-group">
			        <label className="control-label visible-ie8 visible-ie9">手机号码</label>
			        <div className="input-icon">
			            <i className= "fa fa-lock" ></i>
			            <input 
			            	ref = "phoneInput"
			           		className="form-control placeholder-no-fix" 
			           		type="number" autoComplete="off" 
			           		placeholder="手机号码" 
			           		name="phone_number" 
			           	/>
			        </div>
			    </div>
			    <div className="form-group">
                    <label style = {{ marginBottom: 0, width: '55%' }} >
                        <input 
                        	ref = "phoneCodeInput"
                        	type="number" 
                        	className="form-control pull-left" 
                        	placeholder="手机验证码" 
                        	name=""
                        />
                    </label>
                    <div className="pull-right">
                        <a 
                        	ref = "getPhoneCode"
                        	onClick = { () => this.sendPhoneCode( this.refs.phoneInput.value ) }
                        	className = "btn btn-primary" 
                        	style= {{ cursor: 'pointer', verticalAlign: 'middle' }}
                        >
                        	获取手机验证码 
                        </a>
                    </div>
			    </div>
			    <div className="form-group row">
			    	<a 
			    		onClick = { () => this.toRegister( this.refs.phoneInput.value, this.refs.phoneCodeInput.value ) }
			    		className = "btn btn-primary" 
			    		ref = "to_register" 
			    		style = {{ float: 'right', marginRight: '15px' }} 
			    	>
			    		申请注册 
			    	</a>
			    </div>
			</div>
		);
	}
}