import { withPageAuth } from "../features/hocs";

const DashboardPage = () => {
  return (
    <div>
      Dashboard
    </div>
  );
};

export default withPageAuth(DashboardPage, { allowedRoles: ['admin'] });
