from selenium import webdriver
from selenium.webdriver.firefox.options import Options
import csv

options = Options()
options.headless = True
driver = webdriver.Firefox(options=options)


driver.get("https://www.nationaloutdooradvertising.com/locations.php")

stateList = driver.find_element_by_tag_name("section").find_element_by_tag_name("ul")

stateList = stateList.find_elements_by_tag_name("li")

stateURLs = []
stateNames = []

for i in range(len(stateList)):
    state = stateList[i]
    stateURLs.append(state.find_element_by_tag_name("a").get_attribute("href"))
    stateNames.append(state.find_element_by_tag_name("a").text)

# get inside a state
for i in range(len(stateURLs)):
    driver.get(stateURLs[i])
    cityList = driver.find_element_by_xpath("/html/body/div[2]/ul").find_elements_by_tag_name("li")

    cityURLs = []
    cityNames = []
    for j in range(len(cityList)):
        city = cityList[j]
        cityURLs.append(city.find_element_by_tag_name("a").get_attribute("href"))
        cityNames.append(city.find_element_by_tag_name("a").text)
    print("\n\n\n")

    #get inside a city
    for j in range(len(cityURLs)):
        print(cityURLs[j])
        driver.get(cityURLs[j])
        cardList = driver.find_elements_by_class_name("card__action")
        print("\n\n")

        cardURLs = []
        cardNames = []
        for k in range(0, len(cardList), 2):
            cardURLs.append(cardList[k].find_element_by_tag_name("a").get_attribute("href"))
            cardNames.append(cardList[k].find_element_by_tag_name("span").text)

        #get inside a card
        for k in range(len(cardURLs)):
            print(cardURLs[k])
            driver.get(cardURLs[k])
            print("\n")

            tableList = driver.find_elements_by_tag_name("tbody")
            tableNameList = driver.find_elements_by_tag_name("thead")

            #create csv for a table
            for p in range(len(tableList)):
                table = tableList[p]
                with open(stateNames[i]+"-"+cityNames[j]+"-"+cardNames[k]+"-"+tableNameList[p].find_element_by_tag_name("th").text+".csv", 'w', newline='') as csvfile:
                    wr = csv.writer(csvfile)
                    for row in table.find_elements_by_tag_name('tr'):
                        wr.writerow([d.text for d in row.find_elements_by_tag_name('td')])