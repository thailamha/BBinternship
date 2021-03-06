import { Container } from 'unstated';
import axios from 'axios';
import { API } from '../../config';

class UserContainer extends Container {
  state = {
    username: '',
    password: '',
    error: '',
    post: []
  };
  deletePost = async id => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    axios.delete(`${API}/articles/${id}`);
    // this.getMyPost();
    let res = this.state.post.filter(post => post._id != id);
    this.setState({
      eror: res
    });
  };
  getMyPost = async () => {
    const user = localStorage.getItem('user');

    let res = await axios.get(`${API}/articles/${user}`);
    this.setState({ post: res.data });
  };
  register = async info => {
    let data = Object.assign({
      username: info.username,
      password: info.password
    });
    const url = `${API}/user/`;
    let res = await axios.post(url, data);
    if (typeof res.data === 'string') {
      await this.setState({ error: res.data });
    } else {
      window.location.href = '/#/login';
    }
  };
  login = async () => {
    const url = `${API}/user/login`;
    const body = Object.assign({
      username: this.state.username,
      password: this.state.password
    });

    let res = await axios.post(url, body);
    if (typeof res.data === 'object') {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.user);
      window.location.href = '/';
    } else {
      await this.setState({ error: res.data });
    }
  };
  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
}

let User = new UserContainer();

export default User;
