import React from 'react';
import css from './index.scss';
import weixinImg from '../../assets/img/weixin.png'
import testTxt from '../../assets/test.txt';
import { getDate, getHello } from '../../utils'
import NpmTest from 'mmmalik-npmtest';
 
console.log(getDate());
console.log(getHello());

export default class Server extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Text: null
    }
  }

  loadComponent = () => {
    import('../test').then(res => {
      this.setState({ Text: res.default });
    })
  };

  render() {
    const { Text } = this.state;
    return (
      <div>
        <p className={css['text']}>这是home页面的内容12</p>
        <div>
          <img src={weixinImg} />
        </div>
        <p>{testTxt}</p>
        <button onClick={this.loadComponent}>btn</button>
        { Text && <Text/> }
        <NpmTest />
      </div>
    )
  }
}