import type { LLMConfig } from '../../types';

const Settings = () => {
  const handleSaveConfig = (config: LLMConfig) => {
    // TODO: Implement config save via Tauri
    console.log('Save config:', config);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div>
        <h3>LLM Configuration</h3>
        {/* TODO: Add form for LLM config */}
      </div>
      <div>
        <h3>Export Options</h3>
        {/* TODO: Add export format selection */}
      </div>
    </div>
  );
};

export default Settings;
