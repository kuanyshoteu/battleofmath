import React from 'react';
import {NavLink, Link} from 'react-router-dom';

function Sidebar() {

let username = "@nomomon";

return (
<div className="sidebar">
	<div className="sb-header">
		<div className="content">
			<div className="avatar">
				<Link to="/@nomomon" className="user-image">
					<span>
						<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Аватар"></img>
					</span>
				</Link>
				<span className="user-name">
					{username}
				</span>
			</div>
		</div>
	</div>
	<div className="sb-container">
		<div className="top-container">
			<NavLink to="/~" activeClassName="active">
				<span className="ico">
					<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="home-lg-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-home-lg-alt fa-w-18 fa-3x"><path fill="currentColor" d="M570.24 215.42L323.87 13a56 56 0 0 0-71.75 0L5.76 215.42a16 16 0 0 0-2 22.54L14 250.26a16 16 0 0 0 22.53 2L64 229.71V288h-.31v208a16.13 16.13 0 0 0 16.1 16H496a16 16 0 0 0 16-16V229.71l27.5 22.59a16 16 0 0 0 22.53-2l10.26-12.3a16 16 0 0 0-2.05-22.58zM464 224h-.21v240H352V320a32 32 0 0 0-32-32h-64a32 32 0 0 0-32 32v144H111.69V194.48l.31-.25v-4L288 45.65l176 144.62z" className=""></path></svg>
				</span>
				<div className="label">
					Лента
				</div>
			</NavLink>
			<NavLink to="/courses" activeClassName="active">
				<span className="ico">
					<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="inbox" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-inbox fa-w-18 fa-3x"><path fill="currentColor" d="M567.403 235.642L462.323 84.589A48 48 0 0 0 422.919 64H153.081a48 48 0 0 0-39.404 20.589L8.597 235.642A48.001 48.001 0 0 0 0 263.054V400c0 26.51 21.49 48 48 48h480c26.51 0 48-21.49 48-48V263.054c0-9.801-3-19.366-8.597-27.412zM153.081 112h269.838l77.913 112H378.334l-32 64H229.666l-32-64H75.168l77.913-112zM528 400H48V272h120l32 64h176l32-64h120v128z" className=""></path></svg>
				</span>
				<div className="label">
					Курсы
				</div>
			</NavLink>

			<div style={{marginTop: "20px"}}></div>

			<NavLink to="/progress" activeClassName="active">
				<span className="ico">
					<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="chart-bar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-chart-bar fa-w-16 fa-3x"><path fill="currentColor" d="M396.8 352h22.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h22.4c6.4 0 12.8-6.4 12.8-12.8V140.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h22.4c6.4 0 12.8-6.4 12.8-12.8V204.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zM496 400H48V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16zm-387.2-48h22.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8z"></path></svg>
				</span>
				<div className="label">
					Прогресс
				</div>
			</NavLink>

			<div style={{marginTop: "20px"}}></div>

			<NavLink to="/settings" activeClassName="active">
				<span className="ico">
					<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="cog" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-cog fa-w-16 fa-3x"><path fill="currentColor" d="M452.515 237l31.843-18.382c9.426-5.441 13.996-16.542 11.177-27.054-11.404-42.531-33.842-80.547-64.058-110.797-7.68-7.688-19.575-9.246-28.985-3.811l-31.785 18.358a196.276 196.276 0 0 0-32.899-19.02V39.541a24.016 24.016 0 0 0-17.842-23.206c-41.761-11.107-86.117-11.121-127.93-.001-10.519 2.798-17.844 12.321-17.844 23.206v36.753a196.276 196.276 0 0 0-32.899 19.02l-31.785-18.358c-9.41-5.435-21.305-3.877-28.985 3.811-30.216 30.25-52.654 68.265-64.058 110.797-2.819 10.512 1.751 21.613 11.177 27.054L59.485 237a197.715 197.715 0 0 0 0 37.999l-31.843 18.382c-9.426 5.441-13.996 16.542-11.177 27.054 11.404 42.531 33.842 80.547 64.058 110.797 7.68 7.688 19.575 9.246 28.985 3.811l31.785-18.358a196.202 196.202 0 0 0 32.899 19.019v36.753a24.016 24.016 0 0 0 17.842 23.206c41.761 11.107 86.117 11.122 127.93.001 10.519-2.798 17.844-12.321 17.844-23.206v-36.753a196.34 196.34 0 0 0 32.899-19.019l31.785 18.358c9.41 5.435 21.305 3.877 28.985-3.811 30.216-30.25 52.654-68.266 64.058-110.797 2.819-10.512-1.751-21.613-11.177-27.054L452.515 275c1.22-12.65 1.22-25.35 0-38zm-52.679 63.019l43.819 25.289a200.138 200.138 0 0 1-33.849 58.528l-43.829-25.309c-31.984 27.397-36.659 30.077-76.168 44.029v50.599a200.917 200.917 0 0 1-67.618 0v-50.599c-39.504-13.95-44.196-16.642-76.168-44.029l-43.829 25.309a200.15 200.15 0 0 1-33.849-58.528l43.819-25.289c-7.63-41.299-7.634-46.719 0-88.038l-43.819-25.289c7.85-21.229 19.31-41.049 33.849-58.529l43.829 25.309c31.984-27.397 36.66-30.078 76.168-44.029V58.845a200.917 200.917 0 0 1 67.618 0v50.599c39.504 13.95 44.196 16.642 76.168 44.029l43.829-25.309a200.143 200.143 0 0 1 33.849 58.529l-43.819 25.289c7.631 41.3 7.634 46.718 0 88.037zM256 160c-52.935 0-96 43.065-96 96s43.065 96 96 96 96-43.065 96-96-43.065-96-96-96zm0 144c-26.468 0-48-21.532-48-48 0-26.467 21.532-48 48-48s48 21.533 48 48c0 26.468-21.532 48-48 48z" className=""></path></svg>
				</span>

				<div className="label">
					Настройки
				</div>
			</NavLink>
		</div>
		<div className="bottom-container">
			
		</div>
	</div>
</div>
	)
}

export default Sidebar;