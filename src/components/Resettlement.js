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
		this.sendMailCode = ( account, send ) => this.context._event.emit( 'send_mail.resettlement', {
			account: account,
			send: send
		}, ReactDOM.findDOMNode( this.refs.getCode ) );

		//申请重置
		this.toReset = ( account, send, code ) => this.context._event.emit( 'to_reset.resettlement', {
			account: account,
			send: send,
			code: code
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
				        	defaultValue = { this.props.account }
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
			            <i className= "fa fa-user" ></i>
			            <input 
			            	ref = "sendInput"
			            	className = "form-control placeholder-no-fix" 
			            	type = "text" 
			            	autoComplete = "off" 
			            	placeholder = "邮箱/手机号" 
			            	name = "" 
			            />
			        </div>
			    </div>

			    <div className="form-group">
                    <label style = {{ marginBottom: 0 }} >
                        <input 
                        	ref = "codeInput" 
                        	type = "text" 
                        	className = "form-control pull-left" 
                        	placeholder = "验证码" 
                        	name = "" 
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

			    <div className="form-group row">
			    	<a
			    		onClick = { () => this.toReset( this.refs.account.value, this.refs.sendInput.value, this.refs.codeInput.value ) }
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