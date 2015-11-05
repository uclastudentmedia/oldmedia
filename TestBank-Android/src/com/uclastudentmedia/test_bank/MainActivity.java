package com.uclastudentmedia.test_bank;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.uclastudentmedia.test_bank.R;

import android.support.v7.app.ActionBarActivity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

public class MainActivity extends ActionBarActivity {

	private ListView listView;
	private final ArrayList<String> values = new ArrayList<String>();
	public static JsonArray children;
	private SharedPreferences prefs;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		listView = (ListView) findViewById(R.id.list);
		prefs = getSharedPreferences("com.uclastudentmedia.test_bank",0);
		
		Loader loader = new Loader();
		loader.execute();
		
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
		if(id == R.id.action_refresh)
		{
			findViewById(R.id.progressBar1).setVisibility(View.VISIBLE);
			Loader loader = new Loader();
			loader.execute();
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
	private class Loader extends AsyncTask<String,String,String>{

		@Override
		protected String doInBackground(String... params) {
			ConnectivityManager connectivityManager = (ConnectivityManager) MainActivity.this
					.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo activeNetworkInfo;
				activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
			if (activeNetworkInfo == null || !activeNetworkInfo.isConnected())
			{
				MainActivity.this.runOnUiThread(new Runnable() {
				    public void run() {
				    	Toast.makeText(MainActivity.this, "Connect to the internet to view tests.", Toast.LENGTH_SHORT).show();			    }
				});
				
					String cs = prefs.getString("children", "[]");
					children = new JsonParser().parse(cs).getAsJsonArray();
			}
			else{
				try{
					RestTemplate restTemplate = new RestTemplate();
					restTemplate.getMessageConverters().add(
							new StringHttpMessageConverter());
					String rawJson = restTemplate
							.getForObject(
									"https://www.localresearch.com/api/profile/ucla-test-bank/",
									String.class);
					JsonElement object = new JsonParser().parse(rawJson);
					children = object.getAsJsonObject().get("sections")
							.getAsJsonArray().get(0).getAsJsonObject().get("highlights").getAsJsonArray();
					prefs.edit().putString("children",children.toString()).apply();
				}
				catch(Exception e){
					children = new JsonParser().parse(prefs.getString("children", "[]")).getAsJsonArray();
					MainActivity.this.runOnUiThread(new Runnable() {
					    public void run() {
					    	Toast.makeText(MainActivity.this, "An error occurred while updating tests. This may be caused by poor internet connection.", Toast.LENGTH_SHORT).show();			    }
					});
				}
			}
			values.clear();
					for (JsonElement child : children) {
						Log.d("LOG",child.getAsJsonObject().get("name")
								.getAsString());
						values.add(child.getAsJsonObject().get("name")
								.getAsString());
					}
			return null;
		}
		
		 @Override
		    protected void onPostExecute(String result) {
			 ArrayAdapter<String> adapter = new ArrayAdapter<String>(MainActivity.this,
						android.R.layout.simple_list_item_1, android.R.id.text1,values);
			 listView.setAdapter(adapter);
				listView.setOnItemClickListener(new OnItemClickListener() {

					@Override
					public void onItemClick(AdapterView<?> parent, View view,
							int position, long id) {
						
						if(children.get(position).getAsJsonObject().get("entities").getAsJsonArray().size()==0){
							Intent testsIntent = new Intent(MainActivity.this,WebActivity.class);
							testsIntent.putExtra("html",children.get(position).getAsJsonObject().get("description_html").getAsString());
							testsIntent.putExtra("buttonless", true);
							startActivity(testsIntent);
						}
						else{
							Intent testsIntent = new Intent(MainActivity.this, SubjectActivity.class);
							testsIntent.putExtra("index",position);
							startActivity(testsIntent);
						}
					}
				});
				findViewById(R.id.progressBar1).setVisibility(View.GONE);
		 }
	}
}
