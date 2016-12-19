import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { resettlement } from '../style/main.css';

export default class Resettlement extends Component {

	static contextTypes = {

		_event: React.PropTypes.object
	}

	componentDidMount() {

		//发送重置邮件
		const $trigger_sendMail = ReactDOM.findDOMNode( this.refs.getCode );
		this.sendMailCode = async ( account, address ) => {

			if( $trigger_sendMail.className.match( 'disabled' ) )
				return void 0;
			await new Promise( resolve => {

				$trigger_sendMail.className += ' disabled';

				this.context._event.emit( 'send_mail.resettlement', resolve, {
					account: account,
					address: address
				}, $trigger_sendMail );
			} );

			$trigger_sendMail.className = $trigger_sendMail.className.replace( /disabled/gi, '' );

		}

		//申请重置
		const $trigger_toReset = ReactDOM.findDOMNode( this.refs.submitResettlement );
		this.toReset = async () => {

			if( $trigger_toReset.className.match( 'disabled' ) )
				return void 0;
			await new Promise( resolve => {

				$trigger_toReset.className += ' disabled';
				this.context._event.emit( 'to_reset.resettlement', resolve, {
					account: this.refs.account.value, 
					verifType: this.refs.sendInput.value,
					verifCode: this.refs.codeInput.value,
					pwd: this.refs.passwordInput.value
				}, $trigger_toReset );
			} );
			
			$trigger_toReset.className = $trigger_toReset.className.replace( /disabled/gi, '' );
		}
	}

	constructor( props ) {
		
		super( props );	
	}

	render() {
		return (
			<div className = { Resettlement } >
				<div className="form-group">
				    <label className="control-label visible-ie8 visible-ie9">账号</label>
				    <div className="input-icon">
				        <i className= "fa fa-user" ></i>
				        <input 
				        	ref = "account"
				        	className = "form-control placeholder-no-fix" 
				        	type = "text" 
				        	autoComplete = "off" 
				        	placeholder = "账号" 
				        	name = "account" 
				        />
				    </div>
				</div>
			    <div className="form-group">
			        <label className="control-label visible-ie8 visible-ie9">邮箱/手机号</label>
			        <div className="input-icon">
			            <i className= "fa icon-envelope" ></i>
			            <input 
			            	ref = "sendInput"
			            	className = "form-control placeholder-no-fix" 
			            	type = "text" 
			            	autoComplete = "off" 
			            	placeholder = "邮箱/手机号" 
			            	name = "verifType" 
			            />
			        </div>
			    </div>

			    <div className="form-group">
                    <label style = {{ marginBottom: 0 }} >
                        <input 
                        	ref = "codeInput" 
                        	type = "number" 
                        	className = "form-control pull-left" 
                        	placeholder = "验证码" 
                        	name = "verifCode" 
                        />
                    </label>
                    <div className="pull-right">
                        <a
                        	ref = "getCode"
                        	onClick = { () => this.sendMailCode( this.refs.account.value, this.refs.sendInput.value ) }
                        	className = "btn btn-primary"
                        	style= {{ cursor: 'pointer', verticalAlign: 'middle' }}
                       	>
                       		获取验证码
                       	</a>
                    </div>
			    </div>

			    <div className="form-group">
			        <label className="control-label visible-ie8 visible-ie9">密码</label>
			        <div className="input-icon">
			            <i className= "fa fa-lock" ></i>
			            <input
			            	ref = "passwordInput"
			            	className="form-control placeholder-no-fix" 
			            	type="password" 
			            	autoComplete="off" 
			            	placeholder="密码" 
			            	name="pwd" 
			            />
			        </div>
			    </div>

			    <div className="form-group row">
			    	<a
			    		ref = "submitResettlement" 
			    		onClick = { () => this.toReset() }
			    		className = "btn btn-primary" 
			    		style = {{ float: 'right', marginRight: '15px' }} 
			    	>
			    		重置
			    	</a>
			    </div>
			</div>
		);
	}
}