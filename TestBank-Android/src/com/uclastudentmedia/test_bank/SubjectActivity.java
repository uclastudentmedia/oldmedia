package com.uclastudentmedia.test_bank;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.SingleClientConnManager;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.uclastudentmedia.test_bank.MainActivity;
import com.uclastudentmedia.test_bank.R;

import android.support.v7.app.ActionBarActivity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore.Images;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;
import android.widget.AdapterView.OnItemClickListener;

public class SubjectActivity extends ActionBarActivity {

	private JsonArray entities;
	private ArrayList<String> tests;
	private SharedPreferences prefs;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_subject);
		setTitle("Test Bank: UCLA");
		getActionBar().setDisplayHomeAsUpEnabled(true);
		tests = new ArrayList<String>();
		prefs = getSharedPreferences("com.uclastudentmedia.test_bank",0);
		int pos_t = prefs.getInt("hold",0);
		Intent intent = getIntent();
		final int pos = (intent.getIntExtra("index",-1)<0)?pos_t:intent.getIntExtra("index",-1);
				entities = MainActivity.children.get(pos).getAsJsonObject().get("entities").getAsJsonArray();
				prefs.edit().remove("hold").commit();
				for(JsonElement child: entities){
					tests.add(child.getAsJsonObject().get("name").getAsString());
				}
				ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
				android.R.layout.simple_list_item_1,
				android.R.id.text1,tests);
		ListView listview = (ListView)findViewById(R.id.sublist);
		listview.setAdapter(adapter);
		listview.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int position, long id) {
				ConnectivityManager connectivityManager = (ConnectivityManager) SubjectActivity.this
						.getSystemService(Context.CONNECTIVITY_SERVICE);
				NetworkInfo activeNetworkInfo;
					activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
				if (activeNetworkInfo == null || !activeNetworkInfo.isConnected())
				{
					Toast.makeText(SubjectActivity.this, "Connect to the internet to view tests.", Toast.LENGTH_SHORT).show();
					return;
				}
				
				final Intent testIntent = new Intent(SubjectActivity.this, WebActivity.class);
				final String slug = entities.getAsJsonArray().get(position).getAsJsonObject().get("slug").getAsString();
				Log.d("LOG",slug);
				Thread t = new Thread(new Runnable(){
					@Override
					public void run(){
						try{
						int i = 0;
						
						
						RestTemplate restTemplate = new RestTemplate();
						restTemplate.getMessageConverters().add(
								new StringHttpMessageConverter());
						String rawJson = restTemplate
								.getForObject(
										"https://www.localresearch.com/api/media/"+slug+"/",
										String.class);
						JsonElement object = new JsonParser().parse(rawJson);
						for(JsonElement child: object.getAsJsonArray()){
							testIntent.putExtra("url_"+i,child.getAsJsonObject().get("image_url").getAsString()); 
							i++;
						}
						
				
				prefs.edit().putInt("hold", pos).apply();
				  startActivity(testIntent);
						}
				  catch(Exception e){
						SubjectActivity.this.runOnUiThread(new Runnable() {
						    public void run() {
						    	Toast.makeText(SubjectActivity.this, "An error occurred. This may be caused by poor internet connection.", Toast.LENGTH_SHORT).show();			    }
						});
					}
				}
				});
				t.start();
				try {
					t.join();
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.subject, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == android.R.id.home){
			finish();
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
}
