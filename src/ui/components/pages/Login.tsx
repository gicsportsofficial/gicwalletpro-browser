import * as styles from './styles/login.styl';
import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { BigLogo } from '../head';
import { Button, Error, Input } from '../ui';
import { login } from '../../actions';
import { PAGES } from '../../pageConfig';

interface Props extends WithTranslation {
  error: unknown;
  login: (password: string) => void;
  setTab: (tab: string) => void;
}

class LoginComponent extends React.Component<Props> {
  state = {
    passwordError: false,
    password: '',
  };

  readonly props;

  static getDerivedStateFromProps(props, state) {
    const { passwordError } = state;
    const { error } = props;

    if (!passwordError && !!error) {
      return { ...state, passwordError: true };
    }

    return null;
  }

  onChange = e => this._onChange(e);

  onSubmit = e => this._onSubmit(e);

  forgotHandler = () => this.props.setTab(PAGES.FORGOT);

  render() {
    const { t } = this.props;
    return (
      <div className={styles.content}>
        <div className={styles.logoMargin}>
          <BigLogo />
        </div>
        <form onSubmit={this.onSubmit}>
          <div className={`left input-title basic500 tag1`}>
            {t('login.password')}
          </div>
          <div className="margin-main-big relative">
            <Input
              id="loginPassword"
              type="password"
              view="password"
              onChange={this.onChange}
              error={this.state.passwordError}
              autoFocus={true}
              autoComplete="off"
            />
            <Error
              show={this.state.passwordError}
              data-testid="loginPasswordError"
            >
              {t('login.passwordError')}
            </Error>
          </div>
          <Button
            id="loginEnter"
            type="submit"
            view="submit"
            className="margin4"
            disabled={!this.state.password}
          >
            {t('login.enter')}
          </Button>
        </form>
        <div>
          <div className={styles.forgotLnk} onClick={this.forgotHandler}>
            {t('login.passwordForgot')}
          </div>
        </div>
      </div>
    );
  }

  _onChange(e) {
    const password = e.target.value;
    this.setState({ password, passwordError: false });
  }

  _onSubmit(e) {
    e.preventDefault();
    this.props.login(this.state.password);
  }
}

const actions = {
  login,
};

const mapStateToProps = function ({ localState }) {
  return {
    ...localState.login,
  };
};

export const Login = connect(
  mapStateToProps,
  actions
)(withTranslation()(LoginComponent));
