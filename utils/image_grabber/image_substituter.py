import logging
from os import mkdir
from os.path import join as path_join, exists as path_exists
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


def main():
    logging.basicConfig(level=logging.INFO)

    source_file_name = input("Enter input HTML file name: ")
    template_file_name = input("Enter generated template HTML file name: ")
    dest_file_name = input("Enter output HTML file name: ")

    source_img_list = []
    template_img_list = []

    with open(source_file_name, "r", encoding="utf-8") as source_file:
        source_soup = BeautifulSoup(source_file.read(), features="html.parser")
        for elem in source_soup.find_all("img"):
            source_img_list.append(elem)

    with open(template_file_name, "r", encoding="utf-8") as template_file:
        template_soup = BeautifulSoup(template_file.read(), features="html.parser")
        for elem in template_soup.find_all("img"):
            template_img_list.append(elem)

    for source_img, template_img in zip(source_img_list, template_img_list):
        source_img.attrs["src"] = template_img.attrs["src"]

    with open(dest_file_name, "w", encoding="utf-8") as dest_file:
        dest_file.write(source_soup.prettify(formatter="html"))


if __name__ == "__main__":
    main()
