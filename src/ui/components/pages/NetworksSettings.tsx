import * as React from 'react';
import { connect } from 'react-redux';
import { setCustomCode, setCustomMatcher, setCustomNode } from '../../actions';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Button, Copy, Error, Input, Modal } from '../ui';
import * as styles from './styles/settings.styl';
import { getMatcherPublicKey, getNetworkByte } from 'ui/utils/waves';

interface Props extends WithTranslation {
  networks: unknown[];
  currentNetwork: string;
  customNodes: unknown;
  customMatcher: unknown;

  setCustomCode: (payload: unknown) => void;
  setCustomNode: (payload: unknown) => void;
  setCustomMatcher: (payload: unknown) => void;
}

class NetworksSettingsComponent extends React.PureComponent<Props> {
  readonly props;
  readonly state;
  _tCopy;
  _tSave;
  _tSetDefault;

  static getDerivedStateFromProps(props, state) {
    state = { ...state };

    const defaultServers = props.networks.find(
      item => item.name === props.currentNetwork
    );

    const defaultNode = defaultServers.server;
    const currentNode = props.customNodes[props.currentNetwork];
    const isDefault = state.node === defaultNode;
    const isCurrent = currentNode && state.node === currentNode;
    const hasChanges =
      state.node && ((isDefault && currentNode) || (!isCurrent && !isDefault));
    const node =
      hasChanges || state.node != null
        ? state.node
        : currentNode || defaultNode;
    const defaultMatcher = defaultServers.matcher;
    const currentMatcher = props.customMatcher[props.currentNetwork];
    const isDefaultMatcher = state.matcher === defaultMatcher;
    const isCurrentMatcher = currentMatcher && state.matcher === currentMatcher;
    const hasChangesMatcher =
      state.matcher &&
      ((isDefaultMatcher && currentMatcher) ||
        (!isCurrentMatcher && !isDefaultMatcher));
    const matcher =
      hasChangesMatcher || state.matcher != null
        ? state.matcher
        : currentMatcher || defaultMatcher;

    return {
      node,
      defaultNode,
      currentNode,
      hasChanges,
      isDefault,
      isCurrent,
      matcher,
      defaultMatcher,
      currentMatcher,
      hasChangesMatcher,
      isDefaultMatcher,
      isCurrentMatcher,
      showSetDefaultBtn: props.currentNetwork !== 'custom',
    };
  }

  onInputHandler = event =>
    this.setState({ node: event.target.value, nodeError: false });

  onInputMatcherHandler = event =>
    this.setState({ matcher: event.target.value, matcherError: false });

  onSaveNodeHandler = async () => {
    this.setState({ validateData: true });
    try {
      await this.validate();
      this.saveNode();
      this.saveMatcher();
      this.saveCode();
      this.onSave();
    } catch (e) {
      // ignore
    }
    this.setState({ validateData: false });
  };

  saveDefault = () => {
    this.setDefaultNode();
    this.setDefaultMatcher();
    this.onSaveDefault();
  };

  copyHandler = () => this.onCopy();

  async validate() {
    let hasErrors = false;
    const { node, matcher } = this.state;
    const { networks, currentNetwork } = this.props;
    const { code } = networks.find(({ name }) => name === currentNetwork);

    try {
      const newCode = await getNetworkByte(node);
      this.setState({ newCode });
      if (code && code !== newCode) {
        throw new window.Error('Incorrect node network byte');
      }
    } catch (e) {
      this.setState({ nodeError: true });
      hasErrors = true;
    }

    try {
      await getMatcherPublicKey(matcher);
    } catch (e) {
      this.setState({ matcherError: true });
      hasErrors = true;
    }

    if (hasErrors) {
      throw new window.Error('invalid node or matcher');
    }
  }

  render() {
    const { nodeError, matcherError, validateData, showSetDefaultBtn } =
      this.state;
    const { t } = this.props;

    const disableSave = nodeError || matcherError || validateData;
    const disableForm = validateData;

    return (
      <div className={styles.networkTab}>
        <h2 className="title1 margin-main-big">
          {t('networksSettings.network')}
        </h2>

        <div className="margin-main-big relative">
          <label className="input-title basic500 tag1" htmlFor="node_address">
            <Copy text={this.state.node} onCopy={this.copyHandler}>
              <i className={`copy-icon ${styles.copyIcon}`}> </i>
            </Copy>
            {t('networksSettings.node')}
          </label>
          <Input
            disabled={!!disableForm}
            id="node_address"
            value={this.state.node}
            onChange={this.onInputHandler}
          />
          <Error show={nodeError} data-testid="nodeAddressError">
            {t('networkSettings.nodeError')}
          </Error>
        </div>

        <div className="margin-main-big relative">
          <label
            className="input-title basic500 tag1"
            htmlFor="matcher_address"
          >
            <Copy text={this.state.matcher} onCopy={this.copyHandler}>
              <i className={`copy-icon ${styles.copyIcon}`}> </i>
            </Copy>
            {t('networksSettings.matcher')}
          </label>
          <Input
            disabled={!!disableForm}
            id="matcher_address"
            value={this.state.matcher}
            onChange={this.onInputMatcherHandler}
          />
          <Error show={matcherError}>{t('networkSettings.matcherError')}</Error>
        </div>

        <div>
          <Button
            type="submit"
            view="submit"
            disabled={
              disableSave ||
              !(this.state.hasChanges || this.state.hasChangesMatcher)
            }
            className="margin-main-big"
            onClick={this.onSaveNodeHandler}
          >
            {t('networksSettings.save')}
          </Button>
        </div>

        <div>
          {showSetDefaultBtn ? (
            <Button
              id="setDefault"
              type="button"
              disabled={
                disableSave ||
                (this.state.isDefault && this.state.isDefaultMatcher)
              }
              onClick={this.saveDefault}
            >
              {t('networksSettings.setDefault')}
            </Button>
          ) : null}
        </div>

        <Modal
          animation={Modal.ANIMATION.FLASH_SCALE}
          showModal={this.state.showCopied}
        >
          <div className="modal notification">
            {t('networksSettings.copied')}
          </div>
        </Modal>

        <Modal
          animation={Modal.ANIMATION.FLASH_SCALE}
          showModal={this.state.showSaved}
        >
          <div className="modal notification">
            {t('networksSettings.savedModal')}
          </div>
        </Modal>

        <Modal
          animation={Modal.ANIMATION.FLASH_SCALE}
          showModal={this.state.showSetDefault}
        >
          <div className="modal notification">
            {t('networksSettings.setDefaultModal')}
          </div>
        </Modal>
      </div>
    );
  }

  saveNode() {
    const { node, isDefault, hasChanges } = this.state;

    if (isDefault) {
      this.setDefaultNode();
      return null;
    }

    if (hasChanges) {
      this.props.setCustomNode({ node, network: this.props.currentNetwork });
    }
  }

  saveMatcher() {
    const { matcher, isDefaultMatcher, hasChangesMatcher } = this.state;

    if (isDefaultMatcher) {
      this.setDefaultMatcher();
      return null;
    }

    if (hasChangesMatcher) {
      this.props.setCustomMatcher({
        matcher,
        network: this.props.currentNetwork,
      });
    }
  }

  saveCode() {
    const { networks, currentNetwork } = this.props;
    const { code } = networks.find(({ name }) => name === currentNetwork);
    if (!code) {
      this.props.setCustomCode({
        code: this.state.newCode,
        network: currentNetwork,
      });
    }
  }

  setDefaultNode() {
    this.props.setCustomNode({
      node: null,
      network: this.props.currentNetwork,
    });
    this.setState({ node: this.state.defaultNode });
  }

  setDefaultMatcher() {
    this.props.setCustomMatcher({
      matcher: null,
      network: this.props.currentNetwork,
    });
    this.setState({ matcher: this.state.defaultMatcher });
  }

  onCopy() {
    clearTimeout(this._tCopy);
    this.setState({ showCopied: true });
    this._tCopy = setTimeout(() => this.setState({ showCopied: false }), 1000);
  }

  onSave() {
    clearTimeout(this._tSave);
    this.setState({ showSaved: true });
    this._tSave = setTimeout(() => this.setState({ showSaved: false }), 1000);
  }

  onSaveDefault() {
    clearTimeout(this._tSetDefault);
    this.setState({ showSetDefault: true });
    this._tSetDefault = setTimeout(
      () => this.setState({ showSetDefault: false }),
      1000
    );
  }
}

const mapToProps = store => {
  return {
    networks: store.networks,
    currentNetwork: store.currentNetwork,
    customNodes: store.customNodes,
    customMatcher: store.customMatcher,
  };
};

const actions = {
  setCustomNode,
  setCustomMatcher,
  setCustomCode,
};

export const NetworksSettings = connect(
  mapToProps,
  actions
)(withTranslation()(NetworksSettingsComponent));
