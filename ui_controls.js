/**
 * Created by Ben on 8/15/16.
 */

function openTabLeft(evt, tabName) {
    // Declare all variables
    var i, tabcontentLeft, tablinksLeft;

    //If the page has just been loaded, Get all elements with class="tabcontentLeft" and hide them
    if (!document.isInit) {

        document.isInit = 1;
        tabcontentLeft = document.getElementsByClassName("tabcontentLeft");
        for (i = 0; i < tabcontentLeft.length; i++) {
            tabcontentLeft[i].style.display = "none";
        }
    }

    // Get all elements with class="tablinksLeft" and remove the attribute "active"
    tablinksLeft = document.getElementsByClassName("tablinksLeft");
    for (i = 0; i < tablinksLeft.length; i++) {
        if (tablinksLeft[i].hasAttribute("target", "active")) {

            tablinksLeft[i].removeAttribute("target", "active");
        }

    }

    // Show the current tab, and add an "active" attribute to the link
    // that opened the tab, or removes it if it was already open

    if (document.getElementById(tabName).style.display == "none") {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.setAttribute("target", "active");

    }
    else {
        document.getElementById(tabName).style.display = "none";
        document.getElementById(tabName).className.replace("active", "");
        evt.currentTarget.removeAttribute("target", "active");


    }

    // remove all other tabs except for the one that was clicked, but do not let this apply to he help tab

    tabcontentLeft = document.getElementsByClassName("tabcontentLeft");
    for (i = 0; i < tabcontentLeft.length; i++) {

        if (tabcontentLeft[i].id != tabName.toString())
            tabcontentLeft[i].style.display = "none";
    }
}

function openTabRight(evt, tabName) {
    // Declare all variables
    var i, tabcontentRight, tablinksRight;

    //If the page has just been loaded, Get all elements with class="tabcontentRight" and hide them
    if (!document.isInit) {

        document.isInit = 1;
        tabcontentRight = document.getElementsByClassName("tabcontentRight");
        for (i = 0; i < tabcontentRight.length; i++) {
            tabcontentRight[i].style.display = "none";
            console.log("here");
        }
    }

    // Get all elements with class="tablinksRight" and remove the attribute "active"
    tablinksRight = document.getElementsByClassName("tablinksRight");
    for (i = 0; i < tablinksRight.length; i++) {
        if (tablinksRight[i].hasAttribute("target", "active")) {

            tablinksRight[i].removeAttribute("target", "active");
        }

    }

    // Show the current tab, and add an "active" attribute to the link
    // that opened the tab, or removes it if it was already open

    if (document.getElementById(tabName).style.display == "none") {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.setAttribute("target", "active");

    }
    else {
        document.getElementById(tabName).style.display = "none";
        document.getElementById(tabName).className.replace("active", "");
        evt.currentTarget.removeAttribute("target", "active");


    }

    // remove all other tabs except for the one that was clicked, but do not let this apply to he help tab

    tabcontentRight = document.getElementsByClassName("tabcontentRight");
    for (i = 0; i < tabcontentRight.length; i++) {

        if (tabcontentRight[i].id != tabName.toString())
            tabcontentRight[i].style.display = "none";
    }
}

function openTabInfo(evt, tabName) {
    // Declare all variables
    var i, tabcontentInfo, tablinksInfo;

    //If the page has just been loaded, Get all elements with class="tabcontentInfo" and hide them
    if (!document.isInit) {

        document.isInit = 1;
        tabcontentInfo = document.getElementsByClassName("tabcontentInfo");
        for (i = 0; i < tabcontentInfo.length; i++) {
            tabcontentInfo[i].style.display = "none";
            console.log("here");
        }
    }

    // Get all elements with class="tablinksInfo" and remove the attribute "active"
    tablinksInfo = document.getElementsByClassName("tablinksInfo");
    for (i = 0; i < tablinksInfo.length; i++) {
        if (tablinksInfo[i].hasAttribute("target", "active")) {

            tablinksInfo[i].removeAttribute("target", "active");
        }

    }

    // Show the current tab, and add an "active" attribute to the link
    // that opened the tab, or removes it if it was already open

    if (document.getElementById(tabName).style.display == "none") {
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.setAttribute("target", "active");

    }
    else {
        document.getElementById(tabName).style.display = "none";
        document.getElementById(tabName).className.replace("active", "");
        evt.currentTarget.removeAttribute("target", "active");


    }

    // remove all other tabs except for the one that was clicked, but do not let this apply to he help tab

    tabcontentInfo = document.getElementsByClassName("tabcontentInfo");
    for (i = 0; i < tabcontentInfo.length; i++) {

        if (tabcontentInfo[i].id != tabName.toString())
            tabcontentInfo[i].style.display = "none";
    }
}


$('.tabcontentInfo').perfectScrollbar();
$('.tabcontentLeft').perfectScrollbar();
$('.tabcontentRight').perfectScrollbar();


