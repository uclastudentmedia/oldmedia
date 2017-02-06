from bs4 import BeautifulSoup
import urllib2
import string
import re
import io

def get_list(letter, page):
    endpoint = 'http://ucla.orgsync.com/search/get_orgs_by_letter/'
    url = endpoint + letter + '?page=' + str(page)
    html = urllib2.urlopen(url).read()
    a_tags = BeautifulSoup(html, 'html.parser').select('h5 a')
    return map(lambda a: a['href'][2:-2], a_tags)

def get_org(url):
    html = urllib2.urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    name = soup.find('h2').text.strip()
    email = soup.find('a', {'href': re.compile('mailto')})
    if email:
        email = email['href'].split(':')[1]
    else:
        email = ""
    return {'name': name, 'email': email}


with io.open('orgs.csv', 'w', encoding='utf8') as f:
    for letter in string.ascii_uppercase:
        urls = ['']
        page = 1
        while len(urls) > 0:
            urls = get_list(letter, page)
            page += 1
            for url in urls:
                org = get_org(url)
                print org['name'], '\t', org['email']
                f.write('"' + org['name'] + '", ' + org['email'] + '\n')
