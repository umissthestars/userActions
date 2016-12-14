import React, { Component, PropTypes } from 'react';
import ReactDOM, { render } from 'react-dom';
import Next from "./Next";
import { addListener, removeListener } from "../util";
import { register, show, hide } from '../style/main.css';

export default class Register extends Component {

	static contextTypes = {

		_event: React.PropTypes.object
	}

	componentDidMount() {

		const $toggle = this.refs.toggle.querySelectorAll( '.form-group' );

		this.context._event.on( 'show_item.register', ( data ) => {

			;[].map.call( $toggle, ( v, i, a ) => {

				v.className = 'form-group show';
			} );
		} );

		this.context._event.on( 'hide_item.register', ( data ) => {

			;[].map.call( $toggle, ( v, i, a ) => {

				v.className = 'form-group hide';
			} );
		} );

	}

	constructor( props ) {
		
		super( props );

		//发送邮箱验证码
		this.sendMailCode = ( code ) => this.context._event.emit( 'send_mail.register', code, ReactDOM.findDOMNode( this.refs.getMailCode ) );

		//进入下一步 手机验证
		this.toNext = () => {

			const el = [ ...this.refs.step0.querySelectorAll( 'input' ) ];
			const param = {};
			
			el.map( ( v ) => v.value && ( param[ v.name ] = v.value ) );

			this.context._event.emit( 'to_next.register', [
				ReactDOM.findDOMNode( this.refs.step0 ),
				ReactDOM.findDOMNode( this.refs.step1 )
			], param );
		}
	}

	render (){
		return ( 
			<div className = { register } >
				<div ref = "step0" >
					<div className="form-group">
					    <label className="control-label visible-ie8 visible-ie9">姓名</label>
					    <div className="input-icon">
					        <i className= "fa fa-user" ></i>
					        <input className="form-control placeholder-no-fix" type="text" autoComplete="off" placeholder="姓名" name="user_name" />
					    </div>
					</div>
					<div className="form-group">
					    <label className="control-label visible-ie8 visible-ie9">密码</label>
					    <div className="input-icon">
					        <i className= "fa fa-lock" ></i>
					        <input className="form-control placeholder-no-fix" type="password" autoComplete="off" placeholder="密码" name="password" />
					    </div>
					</div>
				    <div className= "form-group">
				        <label className="control-label visible-ie8 visible-ie9">邮箱</label>
				        <div className="input-icon">
				            <i className= "fa fa-lock" ></i>
				            <input
				            	ref = "mailInput"
				             	className = "form-control placeholder-no-fix" 
				             	type = "text" 
				             	autoComplete = "off" 
				             	placeholder = "邮箱" 
				             	name = "email" 
				            />
				        </div>
				    </div>
				    <div className="form-group">
	                    <label style = {{ marginBottom: 0 }} >
	                        <input 
	                        	ref = "mailCodeInput" 
	                        	type = "text" 
	                        	className = "form-control pull-left" 
	                        	placeholder = "邮箱验证码" 
	                        	name = "MailVerifCode" 
	                        />
	                    </label>
	                    <div className="pull-right">
	                        <a
	                        	ref = "getMailCode"
	                        	onClick = { () => this.sendMailCode( this.refs.mailInput.value ) }
	                        	className = "btn btn-primary"
	                        	style= {{ cursor: 'pointer', verticalAlign: 'middle' }}
	                       	>
	                       		获取验证码
	                       	</a>
	                    </div>
				    </div>
				    <div ref = "toggle" >
					    <div className= { "form-group " + hide }>
					        <label className="control-label visible-ie8 visible-ie9">RTX号</label>
					        <div className="input-icon">
					            <i className= "fa fa-lock" ></i>
					            <input className="form-control placeholder-no-fix" type="text" autoComplete="off" placeholder="RTX号" name="rtx_num" />
					        </div>
					    </div>
					    
					    <div className= { "form-group " + hide }>
					        <label className="control-label visible-ie8 visible-ie9">开通接口</label>
					        <div className="input-icon">
					            <i className= "fa fa-lock" ></i>
					            <input className="form-control placeholder-no-fix" type="text" autoComplete="off" placeholder="开通接口" name="api_names" />
					        </div>
					    </div>
					    <div className= { "form-group " + hide }>
					        <label className="control-label visible-ie8 visible-ie9">备注</label>
					        <div className="input-icon">
					            <i className= "fa fa-lock" ></i>
					            <input className="form-control placeholder-no-fix" type="text" autoComplete="off" placeholder="备注" name="remark" />
					        </div>
					    </div>
					</div>
					<div className="form-group row">
						<a 
							className="btn btn-primary" 
							onClick = { this.toNext } 
							style = {{ float: 'right', marginRight: '15px' }} 
						>
							下一步
						</a>
					</div>
				</div>
					
				<div ref ="step1" style = {{ display: 'none' }} >
					<Next />
				</div>
			</div>
		)
	}
}