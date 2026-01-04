import { useState } from "react";
import { useDevIcons } from "./features/shared";
import {
    BannerPreview,
    MeteorEditor,
    useBannerConfig,
    generateSvgCode,
} from "./features/editor";
import { SettingsPanel } from "./features/settings";

export function App() {
    const {
        config,
        selectedMeteor,
        selectedMeteorData,
        setSelectedMeteor,
        updateConfig,
        updateMeteor,
        addMeteor,
        removeMeteor,
    } = useBannerConfig();

    const [iconSearch, setIconSearch] = useState("");
    const { isLoadingIcons, filterIcons } = useDevIcons();
    const filteredIcons = filterIcons(iconSearch);

    const svgCode = generateSvgCode(config);
    const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(svgCode)}`;

    return (
        <div className="flex min-h-screen w-full flex-col gap-4 p-2 sm:p-4 bg-background">
            <BannerPreview
                svgCode={svgCode}
                svgDataUrl={svgDataUrl}
                width={config.width}
            />
            <div className="flex flex-col lg:flex-row flex-1 gap-4 min-h-0">
                <SettingsPanel
                    config={config}
                    selectedMeteor={selectedMeteor}
                    setSelectedMeteor={setSelectedMeteor}
                    updateConfig={updateConfig}
                    addMeteor={addMeteor}
                    removeMeteor={removeMeteor}
                />
                <MeteorEditor
                    selectedMeteorData={selectedMeteorData}
                    updateMeteor={updateMeteor}
                    filteredIcons={filteredIcons}
                    isLoadingIcons={isLoadingIcons}
                    iconSearch={iconSearch}
                    setIconSearch={setIconSearch}
                />
            </div>
        </div>
    );
}

export default App;

