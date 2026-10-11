import { Outlet } from 'react-router';
import styles from './PhoneFrame.module.css';

/** 데스크톱에서는 가운데 휴대폰 크기(390×844) 틀, 휴대폰에서는 화면 전체를 쓴다. */
export function PhoneFrame() {
  return (
    <div className={styles.stage}>
      <div className={styles.phone}>
        <Outlet />
      </div>
    </div>
  );
}
