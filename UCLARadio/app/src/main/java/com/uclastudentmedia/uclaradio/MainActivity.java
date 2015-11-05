package com.uclastudentmedia.uclaradio;

import android.app.Activity;
import android.app.AlertDialog;
//import android.app.Notification;
//import android.app.NotificationManager;
//import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;
import android.widget.SeekBar;
import android.app.ProgressDialog;

import java.io.IOException;


public class MainActivity extends Activity implements MediaPlayer.OnPreparedListener , AudioManager.OnAudioFocusChangeListener{
    MediaPlayer mp;
    public static final String url = "http://128.97.251.120:8000/";
   // private final int notID = 005;
    boolean prepared;
    /** Used to actually adjust the volume */
    private AudioManager mAudioManager;
    /** Used to control the volume for a given stream type */
    private SeekBar mVolumeControls;
    /** True is the volume controls are showing, false otherwise */
    private ProgressDialog loading;
    //Dialog box for loading screen when app opened
    private AlertDialog alertDialog = null;
    //Dialog box for when app has no internet connection
    /*private NotificationManager nm = null;
    private Notification notification = null;*/

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prepared = false;
        //Log.d("test","onCreate");
        setContentView(R.layout.activity_main);
        // MediaPlayer initialization
        mp = new MediaPlayer();
        mp.setOnPreparedListener(this);
        loading = new ProgressDialog(this);
       /* nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Notification.Builder builder = new Notification.Builder(this);
        Intent i = new Intent(this, MainActivity.class);
        i.setAction(Intent.ACTION_MAIN);
        i.addCategory(Intent.CATEGORY_LAUNCHER);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, i, 0);
        builder
                .setSmallIcon(R.drawable.uclaradioicon)
                .setContentTitle("UCLA Radio")
                .setContentText("Tap to reopen app.")
                .setContentIntent(pendingIntent)
                ;
        notification = builder.build();
        */
        //prepareEverything();
        // SplashActivity.main.finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Intent i = getIntent();
        //Log.d("test", "onResume");
        if(alertDialog != null && alertDialog.isShowing())
            alertDialog.dismiss();
       // if(nm != null)
         //   nm.cancel(notID);
        if(!prepared)
            prepareEverything();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d("test", "onPause");
    //    if(prepared && nm != null && mp.isPlaying())
      //      nm.notify(notID, notification);
    }

    @Override
    protected void onStop() {
        super.onStop();
        //Log.d("test", "onStop");

    //    if(!mp.isPlaying())
      //      nm.cancel(notID);
    }

    public void prepareEverything()
    {
        if(connectionStatus())
        {
            //Log.d("test","Connected to internet.");
            loading.setMessage("Loading UCLA Radio...");
            loading.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            loading.setIndeterminate(true);
            loading.setCancelable(false);
            loading.show();
            prepareMediaPlayer();
        }
        else {
            //Log.d("test", "Not Connected to internet");
            AlertDialog.Builder noInternet = new AlertDialog.Builder(this);

            noInternet.setTitle("No Internet Connection!");
            noInternet
                    .setMessage("Please check your network settings.")
                    .setCancelable(false)
                    .setPositiveButton("Settings", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            startActivityForResult(new Intent(Settings.ACTION_SETTINGS), 0);
                        }
                    })
                    .setNegativeButton("Exit", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            // if this button is clicked, close
                            // current activity
                            MainActivity.this.finish();
                        }
                    });
            alertDialog = noInternet.create();
            alertDialog.show();

        }
    }
    public void prepareMediaPlayer()
    {
        mAudioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if(mAudioManager.requestAudioFocus(this,AudioManager.STREAM_MUSIC,AudioManager.AUDIOFOCUS_GAIN) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED){
            try {
                mp.setAudioStreamType(AudioManager.STREAM_MUSIC);
                mp.setDataSource(url);
                mp.prepareAsync();
                // Control the media volume
            }
            catch (IOException e) {}
            catch (IllegalArgumentException e) {}
            catch (IllegalStateException e) {}

        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mp.release();
        mp = null;
        loading = null;
        prepared = false;
        //if(notification != null && nm != null)
     //       nm.cancel(notID);

    }

    @Override
    public void onPrepared(MediaPlayer mp) {
        prepared = true;
       if(loading != null && loading.isShowing())
            loading.dismiss();
    }
    public void onBtnPress(View view)
    {
        if(!prepared)
            return;
        ImageButton playBtn = (ImageButton) findViewById(R.id.imageButton);

        if( mp.isPlaying() )
        {
            playBtn.setBackgroundResource(R.drawable.radio_btn_play);
            mp.pause();
            // mediaPlayer.reset();
        }
        else
        {
            mp.start();
            playBtn.setBackgroundResource(R.drawable.radio_btn_stop);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
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

    @Override
    public void onAudioFocusChange(int focusChange) {

        if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
            try {
                //Log.d("test", "AudioFocus gained");
                mp.setAudioStreamType(AudioManager.STREAM_MUSIC);
                mp.setDataSource(url);
                mp.prepareAsync();
                // Control the media volume
            }
            catch (IOException e) {}
            catch (IllegalArgumentException e) {}
            catch (IllegalStateException e) {}

        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS) {
            //Log.d("test", "Audio Focus Lost");
            try
            {mp.reset();}
            catch(IllegalStateException e) {}
            mAudioManager.abandonAudioFocus(this);
            finish();
            // Stop playback
        }
    }
    public boolean connectionStatus() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return (activeNetwork != null && activeNetwork.isConnectedOrConnecting());
    }

}
