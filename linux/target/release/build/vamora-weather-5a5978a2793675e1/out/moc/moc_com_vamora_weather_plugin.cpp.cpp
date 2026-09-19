/****************************************************************************
** Meta object code from reading C++ file 'com_vamora_weather_plugin.cpp'
**
** Created by: The Qt Meta Object Compiler version 68 (Qt 6.8.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <QtCore/qmetatype.h>
#include <QtCore/qplugin.h>

#include <QtCore/qtmochelpers.h>

#include <memory>


#include <QtCore/qxptype_traits.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'com_vamora_weather_plugin.cpp' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 68
#error "This file was generated using the moc from 6.8.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

#ifndef Q_CONSTINIT
#define Q_CONSTINIT
#endif

QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
QT_WARNING_DISABLE_GCC("-Wuseless-cast")
namespace {
struct qt_meta_tag_ZN25com_vamora_weather_pluginE_t {};
} // unnamed namespace


#ifdef QT_MOC_HAS_STRINGDATA
static constexpr auto qt_meta_stringdata_ZN25com_vamora_weather_pluginE = QtMocHelpers::stringData(
    "com_vamora_weather_plugin"
);
#else  // !QT_MOC_HAS_STRINGDATA
#error "qtmochelpers.h not found or too old."
#endif // !QT_MOC_HAS_STRINGDATA

Q_CONSTINIT static const uint qt_meta_data_ZN25com_vamora_weather_pluginE[] = {

 // content:
      12,       // revision
       0,       // classname
       0,    0, // classinfo
       0,    0, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

       0        // eod
};

Q_CONSTINIT const QMetaObject com_vamora_weather_plugin::staticMetaObject = { {
    QMetaObject::SuperData::link<QQmlEngineExtensionPlugin::staticMetaObject>(),
    qt_meta_stringdata_ZN25com_vamora_weather_pluginE.offsetsAndSizes,
    qt_meta_data_ZN25com_vamora_weather_pluginE,
    qt_static_metacall,
    nullptr,
    qt_incomplete_metaTypeArray<qt_meta_tag_ZN25com_vamora_weather_pluginE_t,
        // Q_OBJECT / Q_GADGET
        QtPrivate::TypeAndForceComplete<com_vamora_weather_plugin, std::true_type>
    >,
    nullptr
} };

void com_vamora_weather_plugin::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    auto *_t = static_cast<com_vamora_weather_plugin *>(_o);
    (void)_t;
    (void)_c;
    (void)_id;
    (void)_a;
}

const QMetaObject *com_vamora_weather_plugin::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *com_vamora_weather_plugin::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_ZN25com_vamora_weather_pluginE.stringdata0))
        return static_cast<void*>(this);
    return QQmlEngineExtensionPlugin::qt_metacast(_clname);
}

int com_vamora_weather_plugin::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QQmlEngineExtensionPlugin::qt_metacall(_c, _id, _a);
    return _id;
}

#ifdef QT_MOC_EXPORT_PLUGIN_V2
static constexpr unsigned char qt_pluginMetaDataV2_com_vamora_weather_plugin[] = {
    0xbf, 
    // "IID"
    0x02,  0x78,  0x2e,  'o',  'r',  'g',  '.',  'q', 
    't',  '-',  'p',  'r',  'o',  'j',  'e',  'c', 
    't',  '.',  'Q',  't',  '.',  'Q',  'Q',  'm', 
    'l',  'E',  'n',  'g',  'i',  'n',  'e',  'E', 
    'x',  't',  'e',  'n',  's',  'i',  'o',  'n', 
    'I',  'n',  't',  'e',  'r',  'f',  'a',  'c', 
    'e', 
    // "className"
    0x03,  0x78,  0x19,  'c',  'o',  'm',  '_',  'v', 
    'a',  'm',  'o',  'r',  'a',  '_',  'w',  'e', 
    'a',  't',  'h',  'e',  'r',  '_',  'p',  'l', 
    'u',  'g',  'i',  'n', 
    // command-line "uri"
    0x63,  'u',  'r',  'i',  0x81,  0x72,  'c',  'o', 
    'm',  '.',  'v',  'a',  'm',  'o',  'r',  'a', 
    '.',  'w',  'e',  'a',  't',  'h',  'e',  'r', 
    0xff, 
};
QT_MOC_EXPORT_PLUGIN_V2(com_vamora_weather_plugin, com_vamora_weather_plugin, qt_pluginMetaDataV2_com_vamora_weather_plugin)
#else
QT_PLUGIN_METADATA_SECTION
Q_CONSTINIT static constexpr unsigned char qt_pluginMetaData_com_vamora_weather_plugin[] = {
    'Q', 'T', 'M', 'E', 'T', 'A', 'D', 'A', 'T', 'A', ' ', '!',
    // metadata version, Qt version, architectural requirements
    0, QT_VERSION_MAJOR, QT_VERSION_MINOR, qPluginArchRequirements(),
    0xbf, 
    // "IID"
    0x02,  0x78,  0x2e,  'o',  'r',  'g',  '.',  'q', 
    't',  '-',  'p',  'r',  'o',  'j',  'e',  'c', 
    't',  '.',  'Q',  't',  '.',  'Q',  'Q',  'm', 
    'l',  'E',  'n',  'g',  'i',  'n',  'e',  'E', 
    'x',  't',  'e',  'n',  's',  'i',  'o',  'n', 
    'I',  'n',  't',  'e',  'r',  'f',  'a',  'c', 
    'e', 
    // "className"
    0x03,  0x78,  0x19,  'c',  'o',  'm',  '_',  'v', 
    'a',  'm',  'o',  'r',  'a',  '_',  'w',  'e', 
    'a',  't',  'h',  'e',  'r',  '_',  'p',  'l', 
    'u',  'g',  'i',  'n', 
    // command-line "uri"
    0x63,  'u',  'r',  'i',  0x81,  0x72,  'c',  'o', 
    'm',  '.',  'v',  'a',  'm',  'o',  'r',  'a', 
    '.',  'w',  'e',  'a',  't',  'h',  'e',  'r', 
    0xff, 
};
QT_MOC_EXPORT_PLUGIN(com_vamora_weather_plugin, com_vamora_weather_plugin)
#endif  // QT_MOC_EXPORT_PLUGIN_V2

QT_WARNING_POP
