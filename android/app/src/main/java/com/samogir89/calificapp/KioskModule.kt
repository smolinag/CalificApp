package com.samogir89.calificapp

import android.app.Activity
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KioskModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "KioskMode"
    }

    private fun getActivity(): Activity? {
        return currentActivity
    }

    @ReactMethod
    fun enter() {
        val activity = getActivity()
        if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            activity.startLockTask()
        }
    }

    @ReactMethod
    fun exit() {
        val activity = getActivity()
        if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            activity.stopLockTask()
        }
    }
}