import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { resettlement } from '../style/main.css';

export default class Resettlement extends Component {

	static contextTypes = {

		_event: React.PropTypes.object
	}

	constructor( props ) {
		
		super( props );

		//发送重置邮件
		this.sendMailCode = ( account, address ) => this.context._event.emit( 'send_mail.resettlement', {
			account: account,
			address: address
		}, ReactDOM.findDOMNode( this.refs.getCode ) );

		//申请重置
		this.toReset = () => this.context._event.emit( 'to_reset.resettlement', {
			account: this.refs.account.value, 
			verifType: this.refs.sendInput.value,
			verifCode: this.refs.codeInput.value,
			pwd: this.refs.passwordInput.value
		} );
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
			    		onClick = { this.toReset }
			    		className = "btn btn-primary" 
			    		ref = "submit_resettlement" 
			    		style = {{ float: 'right', marginRight: '15px' }} 
			    	>
			    		重置
			    	</a>
			    </div>
			</div>
		);
	}
}