
import MessageSampleForSettings from "../components/settings/MessageSampleForSettings";
import ProfileSettings from "../components/settings/ProfileSettings";
import ThemeChangerForSettings from "../components/settings/ThemeChangerForSettings";

const SettingsPage = () => {
  
  return (
    <div className="md:w-11/12 lg:w-10/12 h-screen px-4 py-8 container mx-auto overflow-y-scroll no-scrollbar mt-10 md:mt-0 mb-6">
      <div className="space-y-6">
        <ProfileSettings />
        
        <ThemeChangerForSettings />

        <MessageSampleForSettings />
      </div>
    </div>
  );
};

export default SettingsPage;
