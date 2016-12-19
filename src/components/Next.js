import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { next } from '../style/main.css';

export default class Next extends Component {

	static contextTypes = {

		_event: React.PropTypes.object
	}

	componentDidMount() {
		
		//发送手机验证码
		const $trigger_phoneCode = ReactDOM.findDOMNode( this.refs.getPhoneCode );
		this.sendPhoneCode = async ( code ) => {

			if( $trigger_phoneCode.className.match( 'disabled' ) )
				$trigger_phoneCode.setAttribute( 'disabled', '' );
			await new Promise( resolve => {

				$trigger_phoneCode.className += ' disabled';
				this.context._event.emit( 'send_phone.register', resolve, code, ReactDOM.findDOMNode( this.refs.getPhoneCode ) );
			} );
			$trigger_phoneCode.className = $trigger_phoneCode.className.replace( /disabled/gi, '' );
		}

		//申请注册
		const $trigger_toRegister = ReactDOM.findDOMNode( this.refs.toRegister );
		this.toRegister = async ( phone, code ) => {

			if( $trigger_toRegister.className.match( 'disabled' ) )
				return void 0;
			await new Promise( resolve => {

				$trigger_toRegister.className += ' disabled';
				this.context._event.emit( 'submit.register', resolve, {
					phoneNumber: this.refs.phoneInput.value,
					msgVerifCode: this.refs.phoneCodeInput.value
				}, $trigger_toRegister );
			} );
			$trigger_toRegister.className = $trigger_toRegister.className.replace( /disabled/gi, '' );
		}
	}

	constructor( props ) {
		
		super( props );
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
			    		onClick = { () => this.toRegister() }
			    		className = "btn btn-primary" 
			    		ref = "toRegister" 
			    		style = {{ float: 'right', marginRight: '15px' }} 
			    	>
			    		申请注册 
			    	</a>
			    </div>
			</div>
		);
	}
}