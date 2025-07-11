import * as React from 'react';
import { CSSProperties } from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { AssetDetail } from 'ui/services/Background';
import * as styles from './nftList.module.css';
import { nftRowFullHeight } from 'nfts/constants';
import cn from 'classnames';
import { NftCard } from 'nfts/nftCard';
import { Nft } from 'nfts/utils';
import { DisplayMode } from 'nfts/index';

const Row = ({
  data,
  index,
  style,
}: {
  data: {
    rows: Nft[];
    counts: Record<string, number>;
    mode: DisplayMode;
    len: number;
    onClick: (asset: Nft) => void;
    renderMore: () => void;
  };
  index: number;
  style: CSSProperties;
}) => {
  const { rows, counts = {}, mode, len, onClick, renderMore } = data;

  const leftIndex = 2 * index;
  const leftNft = rows[leftIndex];
  const leftCount = counts[leftNft?.creator] || 0;

  const rightIndex = leftIndex + 1;
  const rightNft = rows[rightIndex];
  const rightCount = counts[rightNft?.creator] || 0;

  return (
    <div style={style}>
      <div className={cn(styles.nftRow, len === 1 && styles.noScroll)}>
        <NftCard
          key={leftIndex}
          nft={leftNft}
          count={leftCount}
          mode={mode}
          onClick={() => onClick(leftNft)}
        />

        {rightNft && (
          <NftCard
            key={rightIndex}
            nft={rightNft}
            count={rightCount}
            mode={mode}
            onClick={() => onClick(rightNft)}
          />
        )}
      </div>

      {typeof renderMore === 'function' && index === len - 1 && renderMore()}
    </div>
  );
};

export function NftList({
  mode,
  nfts,
  counters = {},
  onClick,
  renderMore,
}: {
  mode: DisplayMode;
  nfts: AssetDetail[];
  counters?: Record<string, number>;
  hasMore?: boolean;
  onClick: (asset: Nft) => void;
  renderMore?: () => void;
}) {
  return (
    <div className={styles.nftList}>
      <AutoSizer>
        {({ height, width }) => {
          const len = Math.round(nfts.length / 2);
          return (
            <VariableSizeList
              height={height}
              width={width}
              itemCount={len}
              itemSize={() => nftRowFullHeight}
              itemData={{
                rows: nfts,
                counts: counters,
                mode,
                len,
                onClick,
                renderMore,
              }}
              itemKey={(index, { rows }) => rows[index].id}
            >
              {Row}
            </VariableSizeList>
          );
        }}
      </AutoSizer>
    </div>
  );
}
