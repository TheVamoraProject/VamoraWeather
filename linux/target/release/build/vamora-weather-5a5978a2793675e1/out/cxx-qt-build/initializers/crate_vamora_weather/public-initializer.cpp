
#include <mutex>

extern "C" bool cxx_qt_init_crate_cxx_qt();
extern "C" bool cxx_qt_init_crate_cxx_qt_lib();
#include <QtCore/QtResource>
#include <QtCore/QtResource>
extern "C" bool cxx_qt_init_qml_module_com_vamora_weather();

static bool do_init() {
    static std::once_flag flag;
    std::call_once(flag, []() {
        cxx_qt_init_crate_cxx_qt();
cxx_qt_init_crate_cxx_qt_lib();
Q_INIT_RESOURCE(qml_qrc);
Q_INIT_RESOURCE(assets_qrc);
cxx_qt_init_qml_module_com_vamora_weather();
    });
    return true;
}

extern "C" bool cxx_qt_init_crate_vamora_weather() {
    return do_init();
}
            