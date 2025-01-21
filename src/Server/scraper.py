from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def get_gif_src(query):
    driver = webdriver.Chrome()

    try:
        print("Opening Google Images...")
        driver.get("https://www.google.com/imghp")

        print("Searching for the query...")
        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys(query + " gif")
        search_box.send_keys(Keys.RETURN)

        print("Waiting for images to load...")
        wait = WebDriverWait(driver, 20)
        # Wait for the first image thumbnail to load and be visible
        gif_element = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="rso"]/div/div/div[1]/div/div/div[1]')))
        print("First image located.")

        print("Clicking on the first image...")
        gif_element.click()

        time.sleep(5)

        wait = WebDriverWait(driver, 50)

        print("Waiting for the image viewer to load...")
        # Wait for the main image in the viewer to be fully visible
        gif_viewer = wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="Sva75c"]/div[2]/div[2]/div/div[2]/c-wiz/div/div[2]/div/a/img[1]')))

        # Extract the 'src' attribute from the image viewer
        gif_src = gif_viewer.get_attribute("src")

        # Print the actual gif URL
        print(f"GIF src: {gif_src}")
        return gif_src

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        driver.quit()
