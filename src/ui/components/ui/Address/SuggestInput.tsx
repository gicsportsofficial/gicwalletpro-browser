import * as styles from './SuggestInput.module.css';
import * as React from 'react';
import { libs, validators } from '@waves/waves-transactions';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'ui/store';
import { icontains } from 'ui/components/pages/assets/helpers';
import { Account } from 'accounts/types';
import { AddressTooltip } from '../Address/Tooltip';
import { AddressInput } from './Input';
import { Modal, Button, SearchInput, InputProps, Backdrop } from '..';

interface SuggestProps {
  className?: string;
  paddingRight?: number;
  paddingLeft?: number;
  accounts: Account[];
  addresses: [string, string][];
  setValue: (value: string) => void;
  setAddress: (value: string) => void;
  setShowSuggest: (show: boolean) => void;
  onSuggest?: (value?: string) => void;
}

function Suggest({
  className,
  paddingRight,
  paddingLeft,
  accounts,
  addresses,
  setValue,
  setAddress,
  setShowSuggest,
  onSuggest,
}: SuggestProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.suggest} ${className}`}>
      {accounts.length !== 0 && (
        <>
          <p className={styles.title} style={{ paddingRight, paddingLeft }}>
            {t('address.wallets')}
          </p>
          {accounts.map(account => (
            <div
              className={styles.item}
              style={{ paddingRight, paddingLeft }}
              key={account.address}
              onClick={() => {
                setValue(account.name);
                setAddress(account.address);
                setShowSuggest(false);

                if (onSuggest) {
                  onSuggest(account.address);
                }
              }}
            >
              <p className={styles.name}>{account.name}</p>
              <AddressTooltip address={account.address} />
            </div>
          ))}
        </>
      )}
      {addresses.length !== 0 && (
        <>
          <p className={styles.title} style={{ paddingRight, paddingLeft }}>
            {t('address.title')}
          </p>
          {addresses.map(([address, name]) => (
            <div
              className={styles.item}
              style={{ paddingRight, paddingLeft }}
              key={address}
              onClick={() => {
                setValue(name);
                setAddress(address);
                setShowSuggest(false);

                if (onSuggest) {
                  onSuggest(address);
                }
              }}
            >
              <p className={styles.name}>{name}</p>
              <AddressTooltip address={address} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

interface ModalProps extends SuggestProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export function SuggestModal(props: ModalProps) {
  const { t } = useTranslation();

  const [search, setSearch] = React.useState('');
  const accounts = React.useMemo(
    () =>
      props.accounts.filter(
        account =>
          icontains(account.address, search) || icontains(account.name, search)
      ),
    [props.accounts, search]
  );
  const addresses = React.useMemo(
    () =>
      props.addresses.filter(
        ([address, name]) =>
          icontains(address, search) || icontains(name, search)
      ),
    [props.addresses, search]
  );

  return (
    <Modal animation={Modal.ANIMATION.FLASH} showModal={props.showModal}>
      <div className="modal cover">
        <div className={styles.modalContent}>
          <Button
            className="modal-close"
            type="button"
            view="transparent"
            onClick={() => {
              props.setShowModal(false);
            }}
          />
          <p className={`headline2Bold ${styles.modalTitle}`}>
            {t('address.select')}
          </p>
          <SearchInput
            className={styles.modalSearchInput}
            value={search}
            autoFocus
            onInput={e => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
          {accounts.length > 0 ? (
            <Suggest
              className={styles.modalSuggest}
              paddingLeft={24}
              paddingRight={24}
              accounts={accounts}
              addresses={addresses}
              setValue={props.setValue}
              setAddress={props.setAddress}
              setShowSuggest={props.setShowSuggest}
              onSuggest={value => {
                props.setShowModal(false);

                if (props.onSuggest) {
                  props.onSuggest(value);
                }
              }}
            />
          ) : (
            <p className={styles.notFound}>{t('address.notFound')}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export interface Props extends InputProps {
  onSuggest: (value?: string) => void;
}

export function AddressSuggestInput({ onSuggest, ...props }: Props) {
  const { t } = useTranslation();

  const chainId = useAppSelector(state =>
    state.selectedAccount.networkCode.charCodeAt(0)
  );
  const accounts = useAppSelector(state => state.accounts);
  const addresses = useAppSelector<Record<string, string>>(state =>
    Object.entries(state.addresses).reduce((acc, [address, name]) => {
      if (!validators.isValidAddress(address, chainId)) {
        return acc;
      }

      return libs.crypto.base58Decode(address)[1] === chainId
        ? { ...acc, [address]: name }
        : acc;
    }, {})
  );

  const [value, setValue] = React.useState('');
  const [address, setAddress] = React.useState('');

  const foundAccounts = React.useMemo(
    () =>
      value
        ? accounts.filter(
            account =>
              icontains(account.address, value) ||
              icontains(account.name, value)
          )
        : [],
    [accounts, value]
  );
  const foundAddresses = React.useMemo<Record<string, string>>(
    () =>
      value
        ? Object.entries(addresses).reduce(
            (acc, [address, name]) =>
              icontains(address, value) || icontains(name, value)
                ? { ...acc, [address]: name }
                : acc,
            {}
          )
        : {},
    [addresses, value]
  );

  const [showSuggest, setShowSuggest] = React.useState(false);
  const [showSuggestModal, setShowSuggestModal] = React.useState(false);

  const [highlight, setHighlight] = React.useState('');

  React.useEffect(() => {
    const match = value.match(/^alias:\w:/i);
    setHighlight(match ? match[0] : '');
  }, [value]);

  return (
    <>
      <Backdrop
        onClick={() => {
          setShowSuggest(false);
        }}
      >
        <AddressInput
          {...props}
          autoComplete="off"
          autoFocus
          spellCheck={false}
          value={value}
          onChange={event => {
            setShowSuggest(true);
            setValue(event.currentTarget.value);
            setAddress('');

            if (props.onChange) {
              props.onChange(event);
            }
          }}
        />
        {highlight && <p className={styles.highlight}>{highlight}</p>}
        <button
          className={styles.buttonIcon}
          onClick={() => {
            setShowSuggestModal(true);
          }}
          type="button"
        />
        <SuggestModal
          showModal={showSuggestModal}
          setShowModal={setShowSuggestModal}
          accounts={accounts}
          addresses={Object.entries(addresses).sort(
            ([, firstName], [, secondName]) =>
              firstName.localeCompare(secondName)
          )}
          setValue={setValue}
          setAddress={setAddress}
          setShowSuggest={setShowSuggest}
          onSuggest={onSuggest}
        />
        {address && (
          <AddressTooltip className={styles.tooltip} address={address} />
        )}
        {showSuggest && (
          <Suggest
            accounts={foundAccounts}
            addresses={Object.entries(foundAddresses).sort(
              ([, firstName], [, secondName]) =>
                firstName.localeCompare(secondName)
            )}
            setValue={setValue}
            setAddress={setAddress}
            setShowSuggest={setShowSuggest}
            onSuggest={onSuggest}
          />
        )}
      </Backdrop>
      {highlight && (
        <p className={styles.warningAlias}>{t('address.warningAlias')}</p>
      )}
    </>
  );
}
