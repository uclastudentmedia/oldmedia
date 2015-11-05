package com.uclastudentmedia.uclaradio;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import java.util.Timer;
import java.util.TimerTask;


public class SplashActivity extends Activity {
    // Splash screen timer
    private static int SPLASH_TIME_OUT = 1000;
    public static Activity main;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        main = this;

        /*final Handler handler = new Handler();

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent mainIntent = new Intent(SplashActivity.this, MainActivity.class);
                overridePendingTransition(0, 0);
                startActivity(mainIntent);
                finish();
                handler.removeCallbacks(this);
            }
        }, SPLASH_TIME_OUT);*/
        TimerTask task = new TimerTask()
        {
            @Override
            public void run(){
                finish();
                startActivity(new Intent().setClass(SplashActivity.this,MainActivity.class));
            }
        };
        (new Timer()).schedule(task,0);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.splash, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
