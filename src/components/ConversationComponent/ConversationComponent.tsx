
export default function ConversationComponent() {

    return (
        <div className="left_mprice_box">
            <div className="select_box" id="select_box2">
                <div className="dropdownbox">
                    <img src="assets/images/c8.svg" alt="" />
                    <p>Join The Conversation</p>
                </div>
            </div>

            <div className="price_area">
                <div className="nav" id="nav-tab" role="tablist">
                    <button className="active" id="con_1" data-bs-toggle="tab" data-bs-target="#conver1" type="button" role="tab" aria-controls="conver1" aria-selected="true">
                        <img src="assets/images/msg.svg" alt="" />Chat
                    </button>

                    <button id="con_2" data-bs-toggle="tab" data-bs-target="#conver2" type="button" role="tab" aria-controls="conver2" aria-selected="false"><img src="assets/images/msg2.svg" alt="" /> Twitter</button>
                </div>

                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="conver1" role="tabpanel" aria-labelledby="con_1">
                        <div className="chat_box">
                            {/* <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="user_type">
                                <form action="">
                                    <div className="user_tbox">
                                        <input type="text" placeholder="Have something to say?" />
                                    </div>

                                    <div className="user_send">
                                        <ul>
                                            <li><img src="assets/images/cam.svg" alt="" /></li>
                                            <li><img src="assets/images/send.svg" alt="" /></li>
                                        </ul>
                                    </div>
                                </form>
                            </div> */}
                            {/* <iframe src="https://discord.com/widget?id=954113877858222080&theme=dark" style={{width: '100%', height: '100%'}} allowTransparency={true} frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe> */}
                            <div style={{paddingTop: '260px', textAlign: 'center'}}>
                                <h6>Chat is coming later</h6>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="conver2" role="tabpanel" aria-labelledby="con_2">
                        <div className="chat_box">
                            {/* <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="chat_items">
                                <div className="user">
                                    <img src="assets/images/user.svg" alt="" />
                                </div>
                                <div className="user_msg">
                                    <h1>Mr. Nobody <span>- 16 minutes ago</span></h1>
                                    <p>Chat text goes here...</p>
                                </div>
                            </div>

                            <div className="user_type">
                                <form action="">
                                    <div className="user_tbox">
                                        <input type="text" placeholder="Have something to say?" />
                                    </div>

                                    <div className="user_send">
                                        <ul>
                                            <li><img src="assets/images/cam.svg" alt="" /></li>
                                            <li><img src="assets/images/send.svg" alt="" /></li>
                                        </ul>
                                    </div>
                                </form>
                            </div> */}
                            <div style={{paddingTop: '260px', textAlign: 'center'}}>
                                <h6>Twitter feed is coming later</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
