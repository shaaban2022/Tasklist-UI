import SideNavbar from '../../components/SideNavbar/SideNavbar';
import UserManual from '../../components/UserManual/UserManual';
import "./UserManualLayout.css"

const UserManualLayout = () => {
  return (
    <>
      <div className="user-manual-page-layout">
        <SideNavbar />
        <main className="user-manual-main-content">
          <UserManual />
        </main>
      </div>
    </>
  );
};

export default UserManualLayout;