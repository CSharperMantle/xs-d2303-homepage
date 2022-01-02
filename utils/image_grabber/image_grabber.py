import logging
from os import mkdir
from os.path import splitext, basename, join as path_join, exists as path_exists
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


def get_extension(url: str) -> str:
    parts = urlparse(url)
    _, ext = splitext(basename(parts.path))
    return ext


def main():
    logging.basicConfig(level=logging.INFO)

    source_file_name = input("Enter input HTML file name: ")
    img_dest_folder_name = input("Enter image save folder name: ")

    img_list = []

    with open(source_file_name, "r", encoding="utf-8") as source_file:
        soup = BeautifulSoup(source_file.read(), features="html.parser")
        for elem in soup.find_all("img"):
            img_src = elem.attrs["src"]
            img_list.append(elem)
            logging.debug("Found image at {0}".format(img_src))

    if not path_exists(img_dest_folder_name):
        logging.warning("Destination folder does not exist. Creating...")
        mkdir(img_dest_folder_name)

    if len(img_list) == 0:
        logging.error("No <img> tags found in given HTML file. Exiting...")
        return

    idx = 0
    for img in img_list:
        idx += 1
        img_src = img.attrs.get("src")
        logging.info("Fetching image #{0} from {1}".format(idx, img_src))
        response = requests.get(img_src)

        if not response.ok:
            logging.warning("Failed to fetch image #{0}: {1}".format(idx, response.status_code))
            continue

        full_path = path_join(img_dest_folder_name, str(idx) + get_extension(img_src))
        with open(full_path, "wb") as out_file:
            logging.info("Writing image #{0} to \"{1}\"".format(idx, full_path))
            out_file.write(response.content)


if __name__ == "__main__":
    main()
