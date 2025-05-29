import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import * as styles from './styles/import.styl';
import cn from 'classnames';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '../ui';
import keeperWalletLock from '../../assets/img/keeper-wallet-lock.svg';
import { PAGES } from '../../pageConfig';
import { useAppSelector } from '../../store';
import background from 'ui/services/Background';

interface Props {
  setTab: (newTab: string) => void;
}

export function Import({ setTab }: Props) {
  const { t } = useTranslation();
  const currentNetwork = useAppSelector(state => state.currentNetwork);
  const tabMode = useAppSelector(state => state.localState?.tabMode);

  const [isLedgerSupported, setIsLedgerSupported] = React.useState(false);
  const [isDebug, setDebug] = React.useState(false);

  React.useEffect(() => {
    TransportWebUSB.isSupported().then(setIsLedgerSupported);

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('debug')) {
      setDebug(true);
    }
  }, []);

  return (
    <div data-testid="importForm" className={styles.root}>
      <img
        className={styles.importIcon}
        src={keeperWalletLock}
        alt=""
        width={220}
        height={200}
      />

      {tabMode === 'tab' ? (
        <>
          <Button
            data-testid="createNewAccountBtn"
            type="submit"
            view="submit"
            onClick={() => setTab(PAGES.NEW_ACCOUNT)}
          >
            {t('import.createNew')}
          </Button>

          <div
            className={cn('body1', 'disabled500', 'font300', styles.separator)}
          >
            {t('import.importVia')}
          </div>

          <div>
            {isDebug && (
              <div className={styles.importButtonsItem}>
                <Button
                  className={styles.importButton}
                  data-testid="importDebug"
                  type="button"
                  view="transparent"
                  onClick={() => setTab(PAGES.IMPORT_DEBUG)}
                >
                  <svg
                    className={styles.importButtonIcon}
                    width="25"
                    height="25"
                    viewBox="0 0 48 48"
                    fill="#0055FF"
                  >
                    <path d="M24 42Q20.85 42 18.275 40.225Q15.7 38.45 14.1 35.65L9.1 38.5L7.6 35.95L12.85 32.9Q12.6 32.05 12.4 31.2Q12.2 30.35 12.1 29.5H6V26.5H12.1Q12.2 25.65 12.4 24.8Q12.6 23.95 12.85 23.1L7.6 20L9.1 17.45L14.05 20.35Q14.5 19.55 15.05 18.875Q15.6 18.2 16.2 17.55Q16.1 17.15 16.05 16.775Q16 16.4 16 16Q16 14.6 16.525 13.275Q17.05 11.95 18 10.9L14.7 7.65L16.8 5.5L20.35 9Q21.2 8.5 22.1 8.25Q23 8 24 8Q25 8 25.9 8.25Q26.8 8.5 27.65 9L31.2 5.5L33.3 7.65L30 10.95Q30.9 12 31.425 13.3Q31.95 14.6 31.95 16Q31.95 16.4 31.925 16.75Q31.9 17.1 31.8 17.5Q32.4 18.15 32.925 18.825Q33.45 19.5 33.9 20.3L38.9 17.5L40.4 20.05L35.15 23.05Q35.45 23.9 35.625 24.75Q35.8 25.6 35.9 26.5H42V29.5H35.9Q35.8 30.35 35.625 31.225Q35.45 32.1 35.15 32.95L40.4 36L38.9 38.55L33.9 35.65Q32.3 38.45 29.725 40.225Q27.15 42 24 42ZM19.05 15.3Q20.2 14.65 21.45 14.325Q22.7 14 24 14Q25.3 14 26.525 14.325Q27.75 14.65 28.9 15.25Q28.6 13.6 27.15 12.3Q25.7 11 24 11Q22.3 11 20.825 12.3Q19.35 13.6 19.05 15.3ZM24 39Q27.85 39 30.425 35.55Q33 32.1 33 28Q33 24.25 30.575 20.625Q28.15 17 24 17Q19.85 17 17.425 20.625Q15 24.25 15 28Q15 32.1 17.575 35.55Q20.15 39 24 39ZM22.5 34V22H25.5V34Z" />
                  </svg>
                  {t('import.viaDebug')}
                </Button>
              </div>
            )}

            <div className={styles.importButtonsItem}>
              <Button
                className={styles.importButton}
                data-testid="importSeed"
                type="button"
                view="transparent"
                onClick={() => setTab(PAGES.IMPORT_SEED)}
              >
<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" fill="none">
<rect width="24" height="24" rx="12" fill="url(#pattern0_2244_5)"/>
<defs>
<pattern id="pattern0_2244_5" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_2244_5" transform="scale(0.005)"/>
</pattern>
<image id="image0_2244_5" width="200" height="200" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAIABJREFUeF7t3QW0PUUdB/DF7g5sUUwsDFAMDCxUUEARxQYUxcbAAhEBxQZBQexCBRO7xcBARcUALGzsbjyfOfzemf96Y3fffXfvvjv3nHde7ezOfOf3/dX8ZnajqqrOqsqnIFAQGInARoUgRTIKAuMRKAQp0lEQmIBAIUgRj4JAIUiRgYJANwSKBemGW2m1JAgUgizJRJdhdkOgEKQbbqXVkiBQCLIkE12G2Q2BQpBuuJVWS4JAIciSTHQZZjcECkG64VZaLQkChSBLMtFlmN0QKATphltptSQIFIIsyUSXYXZDoBCkG26l1ZIgUAiyJBNdhtkNgUKQbriVVkuCQCHIkkx0GWY3BApBuuFWWi0JAoUgSzLRZZjdECgE6YZbabUkCBSCLMlEl2F2Q6AQpBtupdWSIFAIsiQTXYbZDYFCkG64lVZLgkAhyJJMdBlmNwQKQbrhVlotCQKFIEsy0WWY3RAoBOmGW2m1JAgUgizJRJdhdkOgEKQbbqXVkiBQCLIkE12G2Q2BQpBuuJVWS4JAIciSTHQZZjcECkG64VZaLQkChSBLMtFlmN0QKATphltptSQIFIIsyUSXYXZDoBCkG26l1ZIgUAiyJBNdhtkNgUKQbriVVkuCQCHIkkx0GWY3BApBuuFWWi0JAoUgSzLRZZjdECgE6YZbabUkCBSCLMlEl2F2Q6AQpBtupdWSIFAIsiQTXYbZDYFCkG64lVZLgkAhyJJMdBlmNwQKQbrhVlotCQKFIEsy0WWY3RAoBOmGW2m1JAgUgizJRJdhdkNg6Qiy0UaGvOHnrLPO6oZeabWCwHrFdd0SxISd4xznWJnA//73v9U4Irg2vjRwXXzNigP1/jS573/+858ml831mlFYwXbcxxwEedYC17Ue/LoiSEyGCfPzuc51rurc5z53+n7Oc54z/Xz+858/fTdpBPDvf/979Y9//CP97Otf//pX+vr3v/+9QrBJ5Go6QZ5/vvOdb0VYprUjTH/961/Hknpa+1n+P3ANBQO/Oq7G5m+uhRdcfeW4whS2obhmgessxznqXoMmSGim0GoXuchFqitd6UrVFa94xepqV7tatckmm6TfL3/5y1eXutSlqgtf+MKJIAjjY4L++c9/JkH83e9+V/3qV7+qfvrTn1Y/+tGPqtNOO636yU9+Uv34xz+ufvazn6WJnaQpJ02U/l372teuHv/4x1cXvehFG5Hkb3/7W/XYxz62+v3vf7/WMvB/989x9U+4wRSWV73qVaurX/3q1ZWvfOXqcpe7XMIV7qF4wgIHrvp/5plnboDrGWeckXD13XWL/BkkQYIQNBphv8lNblLd6U53St+RwsQRRP8Loc5dqHExiPuFcBDQ3/zmN2liv/Od71Sf/vSnq7e85S3J2rT9uOftb3/76s1vfnN1iUtcYipBXE/bXuta10pkDaFr+9y21+e4anujG92oustd7lLd9KY3TQoHrhe/+MWTpeiCq/uzKr/+9a/TuPbdd9/qE5/4xNzG1xYP1w+KIPUJvPOd71w9+tGPrm51q1tVF7jABZLpDjcg9327AEMAfEXswIIQlG9+85utJ9Q9bne72yWC0LjcrUkfY6BZEYSmnQdBAjvf4QlXSodlmBWuEYOEC/agBz2oOu644xLGi5ooGQRBQqsTrMtc5jJJ2B71qEdVt7jFLZLw8HO7BMFNiWPyWJRrXOMa1c9//vPWArvIBNE3uF7ykpdMxNhzzz2rrbfeOv0tBHoaoZviGNeZL+7s/e53v+pTn/rUwpJjEBYkrAYLsdNOO1W77rprtdVWW6WANz6jUoxtJ22aRudqbbrppp1drEWzIHk26t73vnfC9Q53uEN1nvOcZ8UFXCtcuY9iPM/82te+lhTcon4W2oLQXMzx5ptvXj33uc+tbn7zm6eAsB5EriW4Yfq/8pWvVDe72c06uQOLZkEi03TNa16zOvDAA6vb3va2KbaYF64I8uUvf7l6wAMeUP3whz9M8daifhaWIJFp2nbbbavDDjssZVBomlmb+2kTE27Ge97znupe97rXShpzWrv8/4tEkMCPRTvyyCNTUoOABt5txtX1WkrvIx/5SCUGEbAXC9ISSRpOMLvHHntUT3rSk6oLXvCCSTDXyuRPc6+Q5OUvf3lKu+pD23TvIhAkXCpYPvjBD6722Wef6rKXvWwaer6g2nKqWl8eFvmYY46pdttttxTbtcWz9UNX0WDhLIjJYi2e/exnVw984ANTADcpRbuKsTdqGhP6lKc8pXrBC14wWIJEIL7ffvtVD3nIQ1ZijXkrHXgixEtf+tLqyU9+cvp5UTNYCxekm0S+8Itf/OLqvve9b9Js89Ru4xhjAu9///undZDw3xux6+yL+rYg3KcLXehC1SGHHJKsR2Su2oxhVtcihJT5M5/5zKRwFpkcC0UQ5JBBETQ+7nGPW7Ecs5qYrvcxgXzkbbbZJqUku+Ts+yQIXJH6aU97WvWMZzxjTcmRC/s4yxTlPdLJ1oUWOf5YGIIA0+osv5gLkK9odxVs7SLAri8w1u8ZQp8vMsY1/vaHP/yhuuUtb1mdcsopgyJIjGv33XdPVjkW/VaDaR3X/F6jCJJjG/Hbn//852rHHXesPvnJTxaCNJkMwFk0OuKII9KK+GozVXkZRDzf3/7yl79Uf/rTn1K5g9+RUtAqdXze8553xdzXA3Gr2be5zW1SbVYXl6APCxJKQbXBm970pjTG1SQ6Inaox4Pcpd/+9rdJiahpgyuXDq7KapT85G4yi+FaeCrhWeQAfSEsCDDl49/4xjdW17/+9VeVbozSEANTqvHd7363+vjHP1599rOfTZNhFdzkRN7dxNGqVpEV4VlvMXHWW2R4CINrrIHc/e53T0V3XVyCPgii3woM3/nOd6ZxpckesRemiQIz5ig3kXX6xje+UX30ox+tTjjhhITrL3/5y6R08o9niXuucIUrVDe4wQ3S6rx6NDVdatz8zfcuCqdJn2d1Ta9ZLKDT4hYBxR1dNVyATIN9+9vfrt7//vdX1i2+9a1vbbDyPWkycuGhbRXq3frWt06LgywHH55rMASCBK6yRNxW1rFtsiOwMl6K4etf/3r1wQ9+sPrwhz+cVsFDycR1o8hXd5VVPygolcJ/97vfvfDk6NWCBKDqqWg5oLWdxNwftiJrQRExfvCDHyQFkk9QTOQokuQryPUJV+pNwCxodXUHJlmQiJPqGk/V8HWuc53WxYrhAl3vetdLhYBXucpVWuMauBmvQPrtb3979bnPfS6V3uf4TMI0xlOP/wLrrljOyjI0vU9vFiSCNyuqaoC6uAAxQdwogehq922MAi0meDUTOo4gIYh10gY29l0gfpC9yaRGGlpKeuedd27SZOQ1p556arLq3FOWcxyROz9gIA17IUhokbvd7W7Ve9/73qSZ21oPEybOOPbYY1Nlr9iiHlwvyhyMIkiQw6ahpz71qf/nbsCEqyip0PYjrrvnPe+Z3NcuH88WXyjQdK9FrpXqMr42bXojiABOuYENOW2tR2izt771rSk2IGSLrOHGEcS4pY4FrKM+edJhnMsY2NVjgPi9SRA8Ln4Yh2k9k5VbuHqqt0lioG6d8763GUcbwW96bS8EkcaV1ZB+vPSlL90qrRuTxieWGqblFpkcIcD1cvcQJEkFBGniwtWD3kkBci6YoyxrPTYYJzDjhHfc9eEeTupbvW1+bbTPSdcnSeZOEINFENstuRZ+bqJlAlRg/uIXv0gB7B//+MdW/nlTrTHr6yZZEASR3q6TPATFOoKym7ve9a7VxhtvnDYaiS/e9ra3pTZcU9k2++5zYRbkS1a4vxRsvUQmfre3nBVHUlbdmsYXvvCFlK0SlOft9El/PM86Rz5vniHlK8NlbcT/1NRJmU/LTnIlzaXxkAcp9fvc5z4pJWztSvbs6KOP3iBJMOs5Gkt4yZ55PcxzAGCiDVj5RptFQQACbK+99qpe//rXL2zMUcezC0HcQ4bP4inhzbUs4UcqwkgIP/CBD1TXve51Vx6bZ6G+973vVS984QtTNirWKmBOwahOVmOWL5KGxeO2vuxlL6te97rXJdLEAuBmm22W1qw8r+4KIcbnP//5VGhqD7/7P+95z1uJL3NChUIIQiCJ9bBDDz00yUXdVVMa/4Y3vKFTJcNq5HvuFoQ2ufGNb5yCawtZbYJzk/S+972vevjDH9550W41YHVt25Ygrrd7keBbwKx/4GB9xtoEC0C4nJoyzncnbIoUkcQ1UsCveMUr0j3y/eZBrLiP/7lO+Y+1EL8jFkFFkNiWW48hHciwww47JDdaQWIeJ+UumOdJAthnw2U+6qijKomb3M3S1nPVbr3yla9c3wSJgZusV73qVa2shwUrZviRj3xk9Y53vGNQmZUuBHn605+eNDEhkuq1sIYYthtbGbeQyTqEBSG4MFIWw8JwuS52sYutuG5WvsVsUrYf+9jHknUKF81KuLooRx9xa1QThFWRKXzWs56VytN9EDEsiPbIwHLYeKVNZCRf/epXV5Ioj3nMY5KAW0/aYost0jUsmfSxfiKZrQRS2jZw6TPXznqWfrGUiOYQCdasTp6uSqtpu7laEGCYxMMPPzxZgVHZkFEdD832xS9+MZ20Ef5q00H2fV0bgriWViVg3B8CKlbj7hA+q9GsS9QxKeVgabgnYjOuiKpjBCFwarG0U1Wwyy67VHe84x2rl7zkJSsHXRx//PFp4xILEdoaxjaIWWSE/UknnZTWVJTqRFmQE1fEQ9LJ9pU7EsiCr5VyhBDHEGz9Nyakfte73pVKTwg+K8Z1C+uCAAcffHAan+TNQx/60EQ8MsOKIm9cP8/5nCtBIuBjTrfccsvGBAmt9MQnPjFVpfo0SV/OE8hJz2pLEDgZp1jL2JHBNgCBMyHJ45FRBPnMZz6T1kC0ocEpJccV2QOONGE9TjzxxLRIG4e3hSLyXbvnP//5Sdhp/O222y5ZmYhBgiDco5NPPjkNnwtkk5s2Amtt4p43vOENkxVEJGTkZiOKjzFqRwkoVlW1IG6SiJCljORDH3M+V4IAg6k9/fTTU2lJ0+wVYBTJCVa///3vD4ocoSEnpXnrWSwCRnBZhsCIBiXQyj4Imt9pV5bCdVwfi4riDG4Pl4eAEkgfLpaVcYKLVO7LMtlE5Xl5jZnf3Y/FVszp2kc84hGJXPrKxeLSSZiwdCwJF0ncIculXwJ0pT8xfhYkCOJ6BGHxws1DOBaGdfQ3dXViLK4WV009XB+KcW4EiYlmWg28DTkAY7LiHKw+NMlqrFEbCxICRUi5HSwJDRoHVljVRgipX5o/LEhksULQw32NdqoNYMilsvbk77beRuBezxqpcLaISZH5n8JHWj0IEkF6PC+SLZ7LJTNXXKRw2yYRRBvtBehRxGic4ZKTFy6XKuJ1G4MEIe5xj3skTRGCME3wIh0obmH23afJotq0+87z/20JEkJl7Hx8RBGU086hcQmSmMJBerJYNLrnENi4xnduzGtf+9q0xZV7xE3TxrVcOFmqOqaEVfBPMFU2+0QWKSdIHO0abpTrlKhIwuQ1ZO43iSAhC/rBskhQcMEROeQG6VjVqAub1/zNzYJEOpGpFgDGJE4baGg2QoIky0IQuMS5YLS4tQFuC8GJmMxJiFyPSPOKFQTH3C8uKSEVNyjm9HEf8YlAG66qfVmiwDgXdEH5a17zmtQHlgpRuWk8gHCxPMO9ZdbcGzn333//tPYRVq+JBQkZCIvBDXdPGUtuYuxHkbTgbs3T1Zo7QeyLjvRlkzWQmDyn/8U5rrO0IPk6wDSyxv/bunhtLIhrpUJpdylbYw6rwIpwkVgA2jsyVgjiWFTWglBJgmgjRvA9arqMVSDNXfE3adbnPOc5KXuUu7zcJ2sSQUaWxMq2gLmexZI6VkktAeCeVu5lzmS8AqdJFiSsBwKKl5AS8bS1aY3FY/n0D/FYl3kqybkT5KCDDkr+bFMLEkKp/IAgzBocQWgseDWJiwhBbNltSqg2BInzhwXj9sHLPtkSwFLw6wmS+7lu++23T25QThCk4eYEMfKMl/4ScG0ckBFzIC0sRcvyEEaaOkpX3OeAAw6ozBtBF0yzIL7LRtlbzu356le/urIbVPbM2knM1SSChEKwoIjctixQAnaDCvyNJ96r4oy0F73oRTOXgUnzOHeC0FYG2oYgrpUh4XfPkiDuJR4iFILCJgSRgaHdBYxNLVlXgtDgo6ys+1kkVBOF4EEQfZMuVeYxaudjWEvX2MVJY+duVbguEQgjoYrrvffeOwluvpIeBDEvjhE1p0jkgzDcP2svYSFiHcQz9dN6iSxWEERKGUHGfVxrAVMWc127WMoWBIxNCRIa8GEPe1gKNmdJEBNO0KweN3GbXENrcvesBDdpEwLSNM2rTwoBxWk0+ShhsEfey3jUPSnXiTQvISL8LMK4rcHwYz1YH/dAwnwcQRiEgDeXzM9Ri8X9ilITz7MOYqHQ+gXNL3YIxSO+icJFwbeULbcJQRAm1kG4i+IrrjdrUc+oSVuTGQuI6zaLFdoLEMxkW4IATwA4a4JYhJN7D0GeZG7j2H4E4eevBUGiH7JHfPk46MDCHzfLC2c+9KEPJaH1Ea/IZqnJUqLBNSO406yb+6nedXC1lXNKwt8IrbFZLyGYxpynjmXSuFXSy56HLDareR6roOqYwGvrf9FWEC/w9118Yv0k0sDmlCVELmcxs06UhEVRikj9nbWziMWaurazuG7uLhbhikxEE5cmhFBxo0BxGQgSExv41OOIOgZ1HJsQd1yb/O+jsJ7ULnfX6n3I243q36j/dxnXLEiR32NuBInB0jIWrJpo7Ny94HtKMcq8NBGAJkCxaotoQaLvEX/UCVK3DnmcMs1y1HFp+oy83bjnmeOc1PV5yp81jiS5CzXpXk3mdxbXzJUgQLFCS9jluptYkCAJ8xol3rMK0hadILOY4HKP1SEwN4KExUASaUbWINc4k4YRC2NRO+Qes7AihSCrE55laD1XgsRKqeyIhaWmBAkySF8qVZlVucGiECR2DNZJ31YJBJ5t283KIq9HwsyVIASSNZDvVtrs96ZuFhfLUZXSmBbO2vraoyavT4JEf2SjrElsEBieXVOlkDD23TcRPvs3ZL7avC0KBvauy1p1OTWySb+GfM1cCRJulo38Vm4VozUpNwkNRzMqrrMo1XY1e1EJEivz9f4ZKzdUPVWT3D/r7DXVSjUQpc3HWpDKXqv2y3wG1ijM5k4Q2k0ZAzfLymibQxtoOAG++h+lDavVeItgQUxKfRwI0fbo0XiDFILYNdhG8eiDUnaLuAoTZ2Gd2xB0ka+dO0FiJdfCnx2CXY79caKJgjuf1UzmohBklPUgqBbMFCw2iRHgCkuJDKvOFFFTksAwCh1nXc6zyMLfpG9zJ4hOmTgrxIrerKy2sSJRhaoqeLXbb9cTQQJXFb9iNIcfNCVIEJA7J3mihGVWmcImQrjI1/RCENpOWYMiO5tg6gVz0wCLkgN+c9TndLEk640gkfBwsJyqg6blPEEQ7e0Ht7NPAWIhSVX1RhCTooTdET5t3IE8YJcBsj9A6Uq9vHsayULj9rWSPql/BLOtixUJEN8dkKBgUa1VWyuCJPZ02JKgCDLc2C6p45FB79mr7UMhXy8EiclkRWg7FaH5BDcR7pg4hXnO2JLdiurQpuCvNwsSpGdNnWNlF2ZbXIMIig1V8jqLqi2uo+YvilX9z4EQSKzoMgodm875vK/rlSAmQyCqQlUZdBttF0ARBlWh9h4I/OXzad/YBDXJ9VqPBIGLsdsYxTrDt02Ml+MKR6Xs1mns7PP7tHqqXIBZo1j78nev+LZtwTqY9R2JFlUVi5xa7o0goe24V07Wi8xL04XDfCKiFMUEIojdaTY0OToG+Ln2yjVqbBG1XbWJpp1luftauFhxT+P15ZALwm3/RxflE3vBfaftbVOQXrclVho6CDBqLLHNVzm+vSJ2Qtp/4nAJ/xPrSNfbM98lfpyXJemVIKHtnKDBRRKwt0371okSi2r2EQDfhNpHYW9BHN5s74F9DRYqpYx9b/IZCkFC+di9Z+OV8pymZT11HPLYw8+Cd/tF4GqPum26Sn9iYxRCKESVnbTHxEYp611+9omEDJKxIA6Hi783mYN5X9M7QUJz238tBy892XUyc6AjDmHK7WCzuQdB3NuuNZPoNcVxBE4T4IdEkMDVDkDZQjsPV4tr7A/xHZb565+DIKyV5AB3ihLiIeReQfzMakgEOAbVXC2qFVkYgnABvKfC7rG2ad9xwh0kCXOfl2zEM9r450MkCGycZUXrs5xdXK1xLlSeDMn3bgQ5J9XaRSKBe+3n1VZFNFFwXa5ZCIKEqwUoJwA6iob26RKPdAGhaZuhESRcLd933XXXtLC6WgvdFKtp15lrB2bYd8/6FIJMQ+zsFXZ7kZGEZkGS0EYNmq/5JUMkSJBEoGxhVdAeb4fqUwEhiMMn7ImfReHpWk3+wliQGCCzzId1HpKS+Pp207UCosl9h0qQIInYy5qTdSOxwmpikiZ4TbrGvDq8gfsn0J/VQuRq+1Vvv3AEickEmOyLhSqEWU12a1agDZkguRvrPC11cLJcfeFqfrlWslzWsJqU9M9qHtvcZyEJEpPpu8m0RuJ7bATqyzUYOkECV8Jpf7/TDx3TEwmLeeIaFoNFc15WZMjaCO88rl1YguQBphy6nLmDr+O1Yn24BxYd7WrcaaedVn1w3DT3o0stVlOBCSI4S0v1LlzjqNE2uzybPm/UdUEQ77l35m4hSEc0Y7WW9eCvWs21ZmIiafQ2adqOXUhpSBPqWaeeemo6EV0JRtPcvTHUT1bskyDxbOOBo7USQmqhFs6xgr6WFiVS7w6X87qEQpCu0nl2uzjwwYmDUoNOaORDR0YmyklmNamh4XxnOZRGWJl3hmy8AKhpYLmoBMnjPSvgDvXzFioWOyqB1wJXeET1tYoHyqPEIKskiOa5W2UFXLm87aVShcpF8gXG/OdppMnJkC94+buSCu/FsBod5/E2JUYM2T1tEHMIg3PBplk99+diqVvKX0QzAwhH3iLG7LsVcHGJ40j1meu1FrgKzL1tV0GlRcxF/Sx0DDIOtCAK7SYmUblqMk2qkxutGOfCGSu+dcEO98218T+m/4wzzkgnpKtgdQqkba+sSLhUbQmin+qREGTjjTdutACq0FJZuL7MS7sGUfSXpfb6gcBVUK88J8fVz+F+5nM1DldbE7zAR+GjF/0g/6LvgR8kQfLJiLcwhdCqOSKMzLYUolcIm+xRVkQbpt7E2SREk9FqXCgvn8ldkLakqAsMF0ZfYv1hksbUV4tn3pGRk3eeWjZc2ngmYnulAcJQQtwwyikse963qK2yj8QYkMGbqBQ6etFo4BoEm+e42j5r8ASpu14R/MUkIIfKUq6DeMUmLRNIABUyykr5ikrfUZanLaijrg8rMM3dqwvaLJ69mnvk+z9ybFgTbi1cxSvxQp7AVSGjuE3Vbv6J/SGrUTirGU/btuuCIHVtPcolGSeY4X6F25YX4LUFc9r1bcjRl+UYN4ZxfZ+E61opm2k4z/L/644gk8DJJ3MoGmyWk71W91rPuC4VQdZKQMp91y8ChSDrd27LyGaAQCHIDEAst1i/CBSCrN+5LSObAQKFIDMAsdxi/SJQCLJ+57aMbAYIDJYgo8qy62UP9ZqnWOGFW14OETjm//e3aF//e/7s+jMn/S+/Z36QRH0e68+r/3/U2Ee1iTHmKe1RFch1LPLaq/qzR5WWzEAOF/YWgyVI7DKMhT21UrH5P0rT1WSFkMep8FFTZUU9r9kyQ+qC8rfoxjP8Lf+7ratKRzzHSnH9fd9Kxv1PPVV+GAFBtDdcn/zPPUYVLmrjvuPK6eP5+hzlMvoeh3qHgCNS3ler3HFdLpH6oF+xnmE88Bn1yce7sFI9w44NliBeFGPDD4E38ep+vvSlL6Vjg5yD5UX3++67b6p/IjBqgNQF2X9wyimnpLqiJzzhCSuCTqhV7NoHH4LsZffqjfzdwXaEy7322GOPtGnK767xtiwfZRcOm7BvRfnK/vvvX5122mlJ0N1TOcahhx6a7nnwwQenkwXtxfCJsnLXqnR1OqR7jDrtwwanHXfcMfVFH5R1OIT7+OOPT2+J8ncCbn+HZ2y22WbpOpXJ+gunIJfnqqtybKtzwjzvpJNOqrxGAXGCwP5uDPbjqKtquhdmhrLay60GSxBC5ERGhXAEQmEii3Dsscem81833XTTdOq7M3+9IsGLMhUxnnjiiek9fttuu206nJkmV6RIeFXvHnnkkUlYt9lmm3SMqcOVCblXApx55pnpWYccckgil4JGJwPaQ8HCKOJzUqNSfMJtf4WNVSFctLn+KnknuARYJfImm2ySXp9GgJHYW7QQ1WEGowiCPI7xJMhONzQ2r11zb8eNuo9tAMaiFs0p7eqmKAX3Ri6vXQtLo8DTCYzOJXPSCNxU78IETmrWTjjhhCSghx12WKrILQTpha/NH0oIuEC24qoSZSkIqz0U22+/fXX66aeniSYEW2yxRXrfn9e+OYeX1qYhCRBy7Lzzzkk7hvtl8gkCTU3jOlPKARI0p+vsvvN2LMJEU2+33XbpeNPdd989kYVFI5iszMknn7wBQewpQVrPVErvfojEIu65557JwukzN2dcOQzrs/feeyeSHHXUUcmNMlbl/l6l5uVCNnexZKwdpQEr7eKdKk6NiQ+F4EBp40I+55KF5YAjq+Q+LPMin2HVXHqaXzlYC4IghNBbbwkq4Sa0BxxwQBJu1uGYY45J1sAGINt07QZkBRwAwYogCE1KoGhLguAoGq4bt0nFKqFnFRws4HUC7nfggQemF4nSuvZ024Jr/4jfWRKCqTx8EkG84AaxuT5IzoVDrsMPPzxte424ZtRUBkGN1zMR2t4RONhrgTwsEZLYzmrMLBGLxZoGBqxcuH/OInNflgseiIt48OHxoEFBAAAGAUlEQVSSwtn14WY2F7FhXzloghBgmpDbRABoRz4+S4IMtCr3hSvCz/bOC+/w84oxVgZB3COCUsKkjf8hGGIgG8tj89Dmm2+e3J6DDjoonSvreYSRK+Z5SEJL2w7s0LtpBIl+e66+cI+OOOKIDV4ZMIkg3Dz9Y2mU9DvRnktH0Fk7CoJl4Ca6BnG5W7Daeuut04alOkG8VwRBfCgNLhl3Fs4syCK/qmAtqDhogoyzINwM52kRdoLDxSDMhIZrY5Jt1yWUBIDV4SoRLhZEcE34BOdcJ7EL181eePdEAgTh59P+tLc3xLIsNC0tLUPVhSAsSZTr54F7Pvm5BWFxCLz3gLAgAnUukk1fiCseC0vBciKNfRrGNM6CeGsXQhnDKILEHpFliEMGTRB+Ne3Llxdo2t/szUVcCVmtiEG23HLLlNFiPZCBMIcFEROIASKrIz5ggbzLXUoz1gi4G06f32GHHVYsiN11glkCyVfnjiBMBP3uS1DzID1iEC5WbvlYrNyC6A8BZd3qWjtiEC6ZdsjN2umbvjhelFskq+Y5XsfmGpkqbWz9hVt8jJGlYQVlqeCDIKMsiLFECpi7td4/gyUId0Iq97jjjkuCLOskdkAKcYPskNe7CTaRRpBOiGS3ZGsQgXDRpgjB77f/mxXhhrA2++yzT/LDZYiOPvrolLUSu7g//999xByeIzNFOOMlM+43iiDcOxkllkzWKVzDuou11VZbJVfH+BwVmmezZNEE6LJu4ibX+kLMvfbaK5FSUM3SiDcE/hSI7JXXQCCS5IEPcrCyyCGzZssxsnC/jD0sCMsIK66jsWujD94Nsp731gyWIF51zK2gxaxxmFBCzYrwlWW1EIBgEWraWJDti+vki6YlBISEViRghNbEO9AsCEaTIpfMl+Ccu0UTBwFkkvxvt912W3Fz3Nfv9rqHBdEHwb/jipBMosH/aHnC7KRDwsyF2WWXXZIL6ItA5gThAiEAy0I5cAutbSA6xcH1sb2YNWMpxF8yayyWGANOeQaLi2gM0tOEHcngq7/Su6wj64ZcTjnRp9j7jzSFIAtoR7kPsWJNILgisfpswggZbedngTUSxNuPYnGREOVuRqwyW0+R+2cd4iPe0Z4VcW8rzwTGcwX6SOR3ghzvKBcc5+6RPsRLZeJ/+hcv9KGNYw+3Z7GIhN/f849+e35eRZCvcMf6BnzibU/GYkHRuk+9XMR1xhclLDF2/Y3FQ38LXFlA40SOcE0XUERm0qXBWpB8m2fsJ69PfFwTGq6+NXTUfuq8DinXjPm9mt53lGatt80JWn9e9KV+n1Fjd009aI4gP+6j3bjAuo5FHbNRv0cyYSaSuKA3GSxBFhTPmXZrVgI4q/vMdHADuVkhyEAmqnSzHwQKQfrBvTx1IAgUggxkoko3+0GgEKQf3MtTB4JAIchAJqp0sx8ECkH6wb08dSAIFIIMZKJKN/tBoBCkH9zLUweCQCHIQCaqdLMfBApB+sG9PHUgCBSCDGSiSjf7QaAQpB/cy1MHgkAhyEAmqnSzHwQKQfrBvTx1IAgUggxkoko3+0GgEKQf3MtTB4JAIchAJqp0sx8ECkH6wb08dSAIFIIMZKJKN/tBoBCkH9zLUweCQCHIQCaqdLMfBApB+sG9PHUgCBSCDGSiSjf7QaAQpB/cy1MHgkAhyEAmqnSzHwQKQfrBvTx1IAgUggxkoko3+0GgEKQf3MtTB4JAIchAJqp0sx8ECkH6wb08dSAIFIIMZKJKN/tBoBCkH9zLUweCQCHIQCaqdLMfBApB+sG9PHUgCBSCDGSiSjf7QaAQpB/cy1MHgkAhyEAmqnSzHwQKQfrBvTx1IAgUggxkoko3+0GgEKQf3MtTB4JAIchAJqp0sx8ECkH6wb08dSAIFIIMZKJKN/tBoBCkH9zLUweCQCHIQCaqdLMfBApB+sG9PHUgCBSCDGSiSjf7QaAQpB/cy1MHgkAhyEAmqnSzHwQKQfrBvTx1IAgUggxkoko3+0GgEKQf3MtTB4JAIchAJqp0sx8ECkH6wb08dSAIFIIMZKJKN/tB4H9CH4Ol8D73TgAAAABJRU5ErkJggg=="/>
</defs>
</svg>
                {t('import.viaSeed')}
              </Button>
            </div>

            <div className={styles.importButtonsItem}>
              <Button
                className={styles.importButton}
                disabled={!isLedgerSupported}
                type="button"
                view="transparent"
                onClick={() => setTab(PAGES.IMPORT_LEDGER)}
              >
                <svg
                  className={styles.importButtonIcon}
                  width="20"
                  height="21"
                  fill="#000"
                  stroke="#000"
                  viewBox="0 0 20 21"
                >
                  <path d="M19.254 3.558v8.446H8.122V.912h8.54c1.417 0 2.596 1.213 2.592 2.645v.001ZM3.329.912h1.017v3.663H.668V3.563c0-1.483 1.225-2.65 2.661-2.65ZM.668 8.406h3.678v3.662H.668V8.406Zm15.93 11.092H15.58V15.84h3.678v1.007c0 1.483-1.225 2.651-2.662 2.651ZM8.121 15.84H11.8v3.663H8.122V15.84ZM.668 16.852V15.84h3.678v3.663H3.329a2.665 2.665 0 0 1-2.661-2.651Z" />
                </svg>
                <div>
                  <div>{t('import.viaLedger')}</div>
                  {!isLedgerSupported && (
                    <div className={styles.importButtonNote}>
                      {t('import.notSupportedByBrowser')}
                    </div>
                  )}
                </div>
              </Button>
            </div>

            <div className={styles.importButtonsItem}>
              <Button
                className={styles.importButton}
                data-testid="importKeystore"
                type="button"
                view="transparent"
                onClick={() => setTab(PAGES.IMPORT_KEYSTORE)}
              >
                <svg
                  className={styles.importButtonIcon}
                  fill="none"
                  width="19"
                  height="24"
                  viewBox="0 0 19 24"
                >
                  <path
                    d="M0.899002 1.4411C0.899002 1.16496 1.12286 0.941101 1.399 0.941101H11.508C11.6337 0.941101 11.7548 0.988443 11.8472 1.0737L17.7381 6.51153L18.0773 6.14413L17.7381 6.51153C17.8407 6.60618 17.899 6.73938 17.899 6.87893V22.4411C17.899 22.7172 17.6751 22.9411 17.399 22.9411H1.399C1.12286 22.9411 0.899002 22.7172 0.899002 22.4411V1.4411Z"
                    stroke="black"
                  />
                  <path
                    d="M5.72913 10.695L3.41272 13.074L5.72913 15.3973"
                    stroke="#0055FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.0689 15.4113L15.3853 13.0322L13.0689 10.7089"
                    stroke="#0055FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="1"
                    y1="-1"
                    x2="6.6475"
                    y2="-1"
                    transform="matrix(-0.340081 0.940396 -0.937075 -0.349129 9.90149 9.1142)"
                    stroke="#0055FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.4406 5.92972V0.443692C11.4406 0.443692 11.7219 0.363355 12.248 0.805677C12.7741 1.248 17.7982 5.90773 18.0912 6.20076C18.3843 6.49378 18.3843 6.92972 18.3843 6.92972H12.4406C11.8883 6.92972 11.4406 6.482 11.4406 5.92972Z"
                    fill="black"
                  />
                </svg>
                {t('import.viaKeystore')}
              </Button>
            </div>
          </div>
        </>
      ) : (
        tabMode === 'popup' && (
          <>
            <p className="body1 disabled500 font300 center margin-main-big-top margin-main-large">
              <Trans
                i18nKey="import.noAccounts"
                values={{ currentNetwork: t(`bottom.${currentNetwork}`) }}
                t={t}
              />
            </p>
            <Button
              data-testid="addAccountBtn"
              type="submit"
              view="submit"
              onClick={() =>
                background.showTab(
                  `${window.location.origin}/accounts.html`,
                  'accounts'
                )
              }
            >
              {t('import.addAccount')}
            </Button>
          </>
        )
      )}
    </div>
  );
}
