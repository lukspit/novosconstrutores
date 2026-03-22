#!/usr/bin/env python3
"""
Curador automático de novidades — Novos Construtores Vibe Coding
Coleta Reddit + GitHub → curada pelo DeepSeek via OpenRouter → publica no Telegram
"""

import sys
from scraper import collect_all
from curator import curate
from telegram_sender import send


def main():
    dry_run = "--dry-run" in sys.argv

    print("=== Novos Construtores — Curador de Novidades ===\n")

    # 1. Coletar
    posts = collect_all()
    if not posts:
        print("Nenhum post coletado. Encerrando.")
        return

    print(f"\nTotal coletado: {len(posts)} posts\n")

    # 2. Curar
    curated = curate(posts)
    print(f"DeepSeek selecionou {len(curated)} itens\n")

    # 3. Publicar
    if dry_run:
        print("[DRY RUN] Não enviando para o Telegram.")
        from telegram_sender import format_message
        print(format_message(curated))
    else:
        send(curated)

    print("\nPronto!")


if __name__ == "__main__":
    main()
