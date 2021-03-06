import React from 'react';
import logo from '../../logo.svg';
import { connect } from 'react-redux';
import { userLoginSaga } from '@/actions/user';

@connect(({ user }) => ({ user }), { userLoginSaga })
class Home extends React.Component {
    render() {
        const { userLoginSaga } = this.props;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
        </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        haha
        </a>
                    <button onClick={() => userLoginSaga(12)}>click</button>
                </header>
            </div>
        )
    }
}


export default Home;