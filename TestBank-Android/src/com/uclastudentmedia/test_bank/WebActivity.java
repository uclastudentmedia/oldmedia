package com.uclastudentmedia.test_bank;

import java.util.ArrayList;

import com.uclastudentmedia.test_bank.R;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

public class WebActivity extends ActionBarActivity {

	private ArrayList<String> urls;
	private int index;
	private WebView wv;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_web);
		setTitle("Test Bank: UCLA");
		getActionBar().setDisplayHomeAsUpEnabled(true);
		if(getIntent().getBooleanExtra("buttonless", false))
		{
			findViewById(R.id.prev).setVisibility(View.INVISIBLE);
			findViewById(R.id.next).setVisibility(View.INVISIBLE);
			findViewById(R.id.page).setVisibility(View.INVISIBLE);;
			wv = (WebView)findViewById(R.id.webView1);
			wv.setWebViewClient(new WebViewClient());
			wv.loadData(getIntent().getStringExtra("html"), "text/html", null);
			return;
		}
		urls = new ArrayList<String>();
		int i = 0;
		String temp = getIntent().getStringExtra("url_"+i);
		while(temp != null)
		{
			urls.add(temp);
			temp = getIntent().getStringExtra("url_"+(++i));
		}
		if(urls.size() == 0){
			Toast.makeText(this, "This test is missing.", Toast.LENGTH_SHORT).show();
			finish();
		}
		else{
			wv = (WebView)findViewById(R.id.webView1);
			wv.setWebViewClient(new WebViewClient() {
	            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
	                wv.clearView();
	                wv.loadUrl("about:blank");
	                Toast.makeText(WebActivity.this, "Connect to the internet to view tests.", Toast.LENGTH_SHORT).show();
	            }
	        });
			wv.getSettings().setUseWideViewPort(true);
			wv.getSettings().setBuiltInZoomControls(true);
			wv.getSettings().setSupportZoom(true);
			wv.getSettings().setLoadWithOverviewMode(true);
			wv.loadUrl(urls.get(0));
			findViewById(R.id.prev).setVisibility(View.INVISIBLE);
			if(urls.size()==1)
				findViewById(R.id.next).setVisibility(View.INVISIBLE);
			index = 0;
			((TextView)findViewById(R.id.page)).setText("Page "+(index+1)+"/"+urls.size());
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.web, menu);
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
	
	public void prev(View v){
		String temp = getIntent().getStringExtra("url_"+(index-1));
		if(temp!= null)
			index--;
		wv.loadUrl(temp);
		((TextView)findViewById(R.id.page)).setText("Page "+(index+1)+"/"+urls.size());
		if(index == 0)
			v.setVisibility(View.INVISIBLE);
		else if(index == urls.size()-2)
			findViewById(R.id.next).setVisibility(View.VISIBLE);
	}
	public void next(View v){
		String temp = getIntent().getStringExtra("url_"+(index+1));
		if(temp!= null)
			index++;
		wv.loadUrl(temp);
		((TextView)findViewById(R.id.page)).setText("Page "+(index+1)+"/"+urls.size());
		if(index == urls.size()-1)
			v.setVisibility(View.INVISIBLE);
		else if(index == 1)
			findViewById(R.id.prev).setVisibility(View.VISIBLE);
	}
}
