load()

async function load() {
   var anticheats = await (await fetch("./anticheats.json")).json()
   var index = 0
   const numberofanticheats = 163

   document.getElementById("number-of-anticheats").innerHTML = `Number of anticheats: ${numberofanticheats} (${anticheats.length} included)`
   anticheats.forEach(async element => {

      if (element.resourceid != null && (element.status == null || element.rating == null)) {
         data = await fetchData(element.resourceid)
         if (element.status == null) element.status = `${10_368_000_000 > Date.now()-(data.updateDate*1000) ? 'Active' : 'Old'}`
         if (element.rating == null) element.rating = `${(data.rating.average * 20).toFixed(0)}%, ${data.rating.count} rating${data.rating.count == 1 ? '' : 's'}`
      }

      ++index

      // couldn't think of a better way to do this 
      if (index >= anticheats.length) { anticheats
         .sort(function (a, b) {
            // Active
            // Inactive, Unmaintained, Discontinued, Unknown, Old
            // Unavailable

            var StatusA = -1
            var StatusB = -1

            switch (a.status) {
               case "Active":
                  StatusA = 2
                  break
               default:
                  StatusA = 1
                  break
               case "Unavailable":
                  StatusA = 0
                  break
            }
            switch (b.status) {
               case "Active":
                  StatusB = 2
                  break
               default:
                  StatusB = 1
                  break
               case "Unavailable":
                  StatusB = 0
                  break
            }
            if (StatusA == StatusB) return a.name.localeCompare(b.name)
            if (StatusA > StatusB) return -1
            return 1
         })

         .forEach(element => {
            var links = []
            element.links
               .sort(function (a, b) {
                  if (a.name == null || b.name == null) return 0
                  return -a.name.localeCompare(b.name)
               })
               .forEach(element => {if (element.name != null) links.push(`<a href="${element.url}">${element.name}</a>`)})
            document.getElementById("anticheat-table").innerHTML +=
               `<tr>
                  <td>${element.name}</td>
                  <td>${element.platform}</td>
                  <td>${element.status}</td>
                  <td>${element.versions}</td>
                  <td>${element.rating}</td>
                  <td>${element.price}</td>
                  <td>${links.join(", ")}</td>
               </tr>
               `
         })
      }
   })
}

async function toggleTheme() {
   document.body.classList.toggle("dark-mode")
   document.body.classList.toggle("light-mode")
}

async function fetchData(resourceid) {
   return (await fetch(new Request("https://api.spiget.org/v2/resources/"+resourceid))).json()
}
