# For Nana

Open `index.html` to view locally, or upload the whole folder to any static host (Netlify Drop, GitHub Pages, Cloudflare Pages).
`dist/for-nana.html` is the same site as ONE file with the photos built in (run `python3 build.py` to regenerate it).

## Where everything goes
- Photos   -> assets/photos/        (already filled: your 20 photos, renamed + resized)
- Video    -> assets/video/for-nana.mp4 (already in, plus poster.jpg)
- Songs    -> assets/music/wildest-dreams.mp3 and cant-help-falling-in-love.mp3
- ALL words, captions, game, letter, prayer -> js/content.js  (placeholders are in [BRACKETS])

## Photo map (original file -> new name -> where it appears)
| Original | New name | Notes |
|---|---|---|
| IMG_9699.png | 01-facetime.jpg | cloud |
| ba464c3e... | 02-dinner-laughing.jpg | cloud |
| 3cab8697... | 03-dinner-close.jpg | cloud |
| IMG_9021 | 04-scooter.jpg | cloud, "scooter rides" card, ending |
| IMG_1185 | 05-sofa-hug.jpg | cloud, "in your arms" card, ending |
| IMG_1075 | 06-ikea-idiots.jpg | cloud |
| IMG_8943 | 07-bw-cuddle.jpg | cloud |
| IMG_1004 | 08-straw.jpg | cloud |
| F0D2EF6F... | 09-polaroid.jpg | cloud, ending (Meta AI margin cropped off) |
| IMG_7959 | 10-windy-lake.jpg | cloud |
| IMG_7085 | 11-theatre-dark.jpg | cloud (was sideways, rotated) |
| D68748E9... | 12-baby-yellow.jpg | cloud, ending |
| 671E0093... | 13-baby-laughing.jpg | cloud, ending |
| 96074AC9... | 14-pool-hug.jpg | cloud |
| IMG_6530 | 15-pool-kiss.jpg | cloud |
| IMG_5886 | 16-cinema-snacks.jpg | cloud, "eating with you" card, ending |
| IMG_5807.png | 17-matching-jackets.jpg | cloud (black bars trimmed) |
| IMG_5748 | 18-arena.jpg | cloud |
| IMG_5724 | 19-parking-selfie.jpg | cloud |
| IMG_5038 | 20-arch-silhouette.jpg | cloud |

| IMG_4948 | 21-ferry-chin.jpg | cloud |
| IMG_4503 | 22-brick-cheek-kiss.jpg | cloud |
| IMG_4799 | 23-cuddle-closeup.jpg | cloud |
| IMG_4932 | 24-blue-seat-smiles.jpg | cloud |
| IMG_4105 | 25-pink-hat.jpg | cloud (was sideways, rotated) |
| IMG_9902 | 26-fairy-lights-hug.jpg | cloud |

His chat screenshots (IMG_0941, 0943, 0944, 0945) -> assets/chats/chat-1..4.jpg (status bar trimmed), shown in "You being super cute to me". Edit captions in `chats` in js/content.js.

The game: edit `game` in js/content.js (goal = how many kisses, coupon lines, messages).
The entrance answer: `gate.answers` in js/content.js.

To add a photo: put it in assets/photos/, then add a line to `photos` in js/content.js.
To remove one: delete its line.
