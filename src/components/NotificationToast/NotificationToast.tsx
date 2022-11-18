import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

interface Props {
    allToasts:any,
	removeToast:Function,
}

function NotificationToast(Props:any) {

	return (
		<div
		aria-live="polite"
		aria-atomic="true"
		className="position-fixed"
		style={{ bottom: '0px', zIndex: 1 }}
		>
			<div className="toast-container bottom-0 start-0 p-3">
				{(Props.allToasts).map((n:any, index: number) => ( 
					index > 0 &&
					<Toast bg="dark" delay={6000} autohide onClose={() => Props.removeToast(n.id)}>
						<Toast.Header>
							<img
							src="holder.js/20x20?text=%20"
							className="rounded me-2"
							alt=""
							/>
							<strong className="me-auto">Notification</strong>
							<small className="text-muted"></small>
						</Toast.Header>
						<Toast.Body className='text-white'>
							{n.text}
						</Toast.Body>
					</Toast>
				))}
			</div>
		</div>
	);
}

export default NotificationToast;