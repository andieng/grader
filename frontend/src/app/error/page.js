import { Button, Result } from 'antd';
import Link from 'next/link';
const Error = ({ errInfo }) => (
  <Result
    status="403"
    title="403"
    subTitle={errInfo}
    extra={
      <Link href={'/'}>
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);
export default Error;
