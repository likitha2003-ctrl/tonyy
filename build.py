"""Builds dist/for-nana.html: one self-contained file (photos embedded). Run: python3 build.py"""
import base64, re, os
root = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(root, p), encoding='utf-8').read()
html = rd('index.html')
css = rd('css/style.css')
js = '\n'.join(rd(f) for f in ('js/content.js', 'js/icons.js', 'js/app.js'))
photos = {}
for f in sorted(os.listdir(os.path.join(root, 'assets/photos'))):
    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
        photos[f] = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(root, 'assets/photos', f), 'rb').read()).decode()
for f in sorted(os.listdir(os.path.join(root, 'assets/chats'))):
    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
        photos[f] = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(root, 'assets/chats', f), 'rb').read()).decode()
for key, f in (('video','assets/video/for-nana.mp4'),):
    if os.path.exists(os.path.join(root,f)):
        photos[key] = 'data:video/mp4;base64,' + base64.b64encode(open(os.path.join(root,f),'rb').read()).decode()
if os.path.exists(os.path.join(root,'assets/video/poster.jpg')):
    photos['poster'] = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(root,'assets/video/poster.jpg'),'rb').read()).decode()
import json
data = 'window.PHOTO_DATA=' + json.dumps(photos) + ';\n'
html = re.sub(r'<link rel="stylesheet" href="css/style.css">', lambda m: '<style>' + css + '</style>', html)
html = re.sub(r'<script src="js/content.js"></script>\s*<script src="js/icons.js"></script>\s*<script src="js/app.js"></script>',
              lambda m: '<script>' + data + js.replace('</script>', '<\\/script>') + '</script>', html)
os.makedirs(os.path.join(root, 'dist'), exist_ok=True)
open(os.path.join(root, 'dist/for-nana.html'), 'w', encoding='utf-8').write(html)
print('built', round(len(html) / 1024), 'KB')
