
#include <QtQml/qqmlextensionplugin.h>

// TODO: Add missing handling for GHS (Green Hills Software compiler) that is in
// https://code.qt.io/cgit/qt/qtbase.git/plain/src/corelib/global/qtsymbolmacros.h
extern void qml_register_types_com_vamora_weather();
extern int qInitResources_qml_module_resources_com_vamora_weather_qrc();

class com_vamora_weather_plugin : public QQmlEngineExtensionPlugin
{
    Q_OBJECT
    Q_PLUGIN_METADATA(IID "org.qt-project.Qt.QQmlEngineExtensionInterface")

public:
    com_vamora_weather_plugin(QObject *parent = nullptr) : QQmlEngineExtensionPlugin(parent)
    {
        volatile auto qml_register_types_com_vamora_weather_usage = &qml_register_types_com_vamora_weather;
Q_UNUSED(qml_register_types_com_vamora_weather_usage);
volatile auto qInitResources_qml_module_resources_com_vamora_weather_qrc_usage = &qInitResources_qml_module_resources_com_vamora_weather_qrc;
Q_UNUSED(qInitResources_qml_module_resources_com_vamora_weather_qrc_usage);
    }
};

extern "C" {
    // "drive-by initialization" causes the plugin class to be included in static linking scenarios
    // Any function that is called from within this file causes the entire object file to be linked in.
    // Therefore we provide an empty function that can be called at any point to ensure this file is linked in.
    bool init_cxx_qt_qml_module_com_vamora_weather_plugin() {
        return true;
    }
}

// The moc-generated cpp file doesn't compile on its own; it needs to be #included here.
#include "moc_com_vamora_weather_plugin.cpp.cpp"
