import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone

HEADERS = {"User-Agent": "NovosConstrutores-VibeCoding/1.0"}

REDDIT_SUBS = [
    "ClaudeAI",
    "ChatGPT",
    "LocalLLaMA",
    "artificial",
    "MachineLearning",
    "singularity",
    "vibecoding",
]

GITHUB_TOPICS = ["llm", "ai-agent", "claude", "chatgpt", "vibe-coding", "openai"]

GOOGLE_NEWS_QUERIES = [
    "Claude AI Anthropic",
    "ChatGPT OpenAI lançamento",
    "inteligência artificial ferramenta nova",
    "vibe coding AI",
    "LLM AI agent 2025",
]

DEVTO_TAGS = ["ai", "claudeai", "llm", "machinelearning", "chatgpt"]


def get_reddit_posts(limit_per_sub=15):
    posts = []
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)

    for sub_name in REDDIT_SUBS:
        url = f"https://www.reddit.com/r/{sub_name}/hot.json?limit={limit_per_sub}"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            resp.raise_for_status()
            for child in resp.json()["data"]["children"]:
                post = child["data"]
                created = datetime.fromtimestamp(post["created_utc"], tz=timezone.utc)
                if created < cutoff:
                    continue
                posts.append({
                    "source": f"Reddit r/{sub_name}",
                    "title": post["title"],
                    "url": f"https://reddit.com{post['permalink']}",
                    "score": post["score"],
                    "comments": post["num_comments"],
                    "body": (post.get("selftext") or "")[:300],
                })
        except Exception as e:
            print(f"[Reddit] Erro em r/{sub_name}: {e}")

    posts.sort(key=lambda x: x["score"], reverse=True)
    return posts[:40]


def get_hackernews():
    posts = []
    cutoff = int((datetime.now(timezone.utc) - timedelta(hours=24)).timestamp())

    try:
        url = (
            f"https://hn.algolia.com/api/v1/search"
            f"?query=AI+LLM+claude+chatgpt+agent&tags=story"
            f"&numericFilters=created_at_i>{cutoff},points>20"
            f"&hitsPerPage=30"
        )
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        for hit in resp.json().get("hits", []):
            posts.append({
                "source": "Hacker News",
                "title": hit.get("title", ""),
                "url": hit.get("url") or f"https://news.ycombinator.com/item?id={hit['objectID']}",
                "score": hit.get("points", 0),
                "comments": hit.get("num_comments", 0),
                "body": "",
            })
    except Exception as e:
        print(f"[HackerNews] Erro: {e}")

    return posts


def get_google_news():
    posts = []
    seen = set()

    for query in GOOGLE_NEWS_QUERIES:
        url = f"https://news.google.com/rss/search?q={requests.utils.quote(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            resp.raise_for_status()
            root = ET.fromstring(resp.content)
            for item in root.findall(".//item")[:5]:
                title = item.findtext("title", "")
                link = item.findtext("link", "")
                pub_date = item.findtext("pubDate", "")
                if link and link not in seen:
                    posts.append({
                        "source": f"Google News ({query})",
                        "title": title,
                        "url": link,
                        "score": 500,
                        "comments": 0,
                        "body": pub_date,
                    })
                    seen.add(link)
        except Exception as e:
            print(f"[GoogleNews] Erro em '{query}': {e}")

    return posts


def get_devto():
    posts = []
    seen = set()
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%Y-%m-%d")

    for tag in DEVTO_TAGS:
        url = f"https://dev.to/api/articles?tag={tag}&top=1&per_page=5"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            resp.raise_for_status()
            for article in resp.json():
                if article["url"] not in seen:
                    posts.append({
                        "source": f"Dev.to #{tag}",
                        "title": article["title"],
                        "url": article["url"],
                        "score": article.get("positive_reactions_count", 0),
                        "comments": article.get("comments_count", 0),
                        "body": article.get("description", "")[:200],
                    })
                    seen.add(article["url"])
        except Exception as e:
            print(f"[Dev.to] Erro em #{tag}: {e}")

    posts.sort(key=lambda x: x["score"], reverse=True)
    return posts[:15]


def get_github_trending():
    posts = []
    seen = set()
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    for topic in GITHUB_TOPICS:
        url = (
            "https://api.github.com/search/repositories"
            f"?q=pushed:>{yesterday}+topic:{topic}&sort=stars&order=desc&per_page=5"
        )
        try:
            resp = requests.get(url, headers={"Accept": "application/vnd.github+json"}, timeout=10)
            resp.raise_for_status()
            for repo in resp.json().get("items", []):
                if repo["html_url"] not in seen:
                    posts.append({
                        "source": f"GitHub #{topic}",
                        "title": repo["full_name"],
                        "url": repo["html_url"],
                        "score": repo["stargazers_count"],
                        "comments": repo.get("open_issues_count", 0),
                        "body": repo.get("description") or "",
                    })
                    seen.add(repo["html_url"])
        except Exception as e:
            print(f"[GitHub] Erro em topic {topic}: {e}")

    posts.sort(key=lambda x: x["score"], reverse=True)
    return posts[:20]


def collect_all():
    sources = [
        ("Reddit", get_reddit_posts),
        ("Hacker News", get_hackernews),
        ("Google News", get_google_news),
        ("Dev.to", get_devto),
        ("GitHub", get_github_trending),
    ]

    all_posts = []
    for name, fn in sources:
        print(f"Coletando {name}...")
        try:
            result = fn()
            print(f"  {len(result)} itens")
            all_posts.extend(result)
        except Exception as e:
            print(f"  Erro: {e}")

    print(f"\nTotal bruto: {len(all_posts)} itens de {len(sources)} fontes")
    return all_posts
