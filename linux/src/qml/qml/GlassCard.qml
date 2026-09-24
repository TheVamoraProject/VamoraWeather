import QtQuick

// ok lets sing misery now...
// i miss that kind of misery
// the kind when you were nice to me
//
// but only in the evening
// so i ask am i just dreaming
Item {
    id: root
    default property alias data: body.data
    property int cardRadius: 22

    // ily so much that its dripping 
    // dripping from my arms and such
    // im sorry i know im too much 
    height: body.childrenRect.height + body.childrenRect.y

    // to love, to trust, im nothing but 
     // anyways go to the iconimage file, ill continue here.
    Rectangle {
        anchors.fill: parent
        anchors.topMargin: 4
        radius: root.cardRadius
        color: "#33000000"
        z: -1
    }

    Rectangle {
        anchors.fill: parent
        radius: root.cardRadius
        color: "#0DFFFFFF"          // rgba(255,255,255,0.05)
        border.color: "#17FFFFFF"   // rgba(255,255,255,0.09)
        border.width: 1
    }

    Item {
        id: body
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        
    }
}
