package dataloader

import (
	"fmt"
	"lambdas/user_manager/openapi"
	"log"
	"strings"
	"time"
)

type columnHandler func(s *[]openapi.UserData, data string) error

var handlers = map[string]columnHandler{
	"firstname": func(s *[]openapi.UserData, data string) error {
		if len(strings.TrimSpace(data)) == 0 {
			return nil
		}
		u := openapi.UserData{
			FirstName: data,
		}
		*s = append(*s, u)
		return nil
	},
	"middlename": func(s *[]openapi.UserData, data string) error {
		if len(*s) == 0 || len(strings.TrimSpace(data)) == 0 {
			return nil
		}
		(*s)[len(*s)-1].MiddleName = strings.TrimSpace(data)
		return nil
	},
	"lastname": func(s *[]openapi.UserData, data string) error {
		if len(*s) == 0 || len(strings.TrimSpace(data)) == 0 {
			return nil
		}
		(*s)[len(*s)-1].LastName = strings.TrimSpace(data)
		return nil
	},
	"baptismalname": func(s *[]openapi.UserData, data string) error {
		if len(*s) == 0 || len(strings.TrimSpace(data)) == 0 {
			return nil
		}
		(*s)[len(*s)-1].BaptismalName = strings.TrimSpace(data)
		return nil
	},
	"gender": func(s *[]openapi.UserData, data string) error {
		if len(*s) == 0 || len(strings.TrimSpace(data)) == 0 {
			return nil
		}
		g := strings.ToLower(data)
		if strings.HasPrefix(g, "m") {
			(*s)[len(*s)-1].Gender = "male"
		} else if strings.HasPrefix(g, "f") {
			(*s)[len(*s)-1].Gender = "female"
		}
		return nil
	},
	"dateofbirth": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		formatted, err := parseDate(d)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		(*s)[len(*s)-1].DateOfBirth = *formatted
		return nil
	},
	"familyunit": func(s *[]openapi.UserData, data string) error {
		if len(*s) == 0 || len(strings.TrimSpace(data)) == 0 {
			return nil
		}
		(*s)[len(*s)-1].FamilyUnit = data
		return nil
	},
	"dateofbaptism": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		formatted, err := parseDate(d)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		(*s)[len(*s)-1].DateOfBaptism = *formatted
		return nil
	},
	"dateofconfirmation": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		formatted, err := parseDate(d)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		(*s)[len(*s)-1].DateOfConfirmation = *formatted
		return nil
	},
	"dateofmarriage": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		formatted, err := parseDate(d)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		(*s)[len(*s)-1].DateOfMarriage = *formatted
		return nil
	},
	"incanadasince": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		formatted, err := parseDate(d)
		if err != nil {
			fmt.Println(err)
			return nil
		}
		(*s)[len(*s)-1].InCanadaSince = *formatted
		return nil
	},
	"nolabel": func(s *[]openapi.UserData, data string) error {
		d := strings.ToLower(strings.TrimSpace(data))
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		if strings.HasPrefix(d, "mar") {
			(*s)[len(*s)-1].MaritalStatus = "married"
		} else if strings.HasPrefix(d, "unmar") {
			(*s)[len(*s)-1].MaritalStatus = "unmarried"
		}
		return nil
	},
	"statusincanada": func(s *[]openapi.UserData, data string) error {
		d := strings.ToLower(strings.TrimSpace(data))
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		if strings.HasPrefix(d, "pr") {
			(*s)[len(*s)-1].CanadianStatus = "permanentResident"
		} else if strings.HasPrefix(d, "citi") {
			(*s)[len(*s)-1].MaritalStatus = "citizen"
		} else if strings.HasPrefix(d, "work") {
			(*s)[len(*s)-1].MaritalStatus = "workPermit"
		} else if strings.HasPrefix(d, "visi") {
			(*s)[len(*s)-1].MaritalStatus = "visitor"
		} else if strings.HasPrefix(d, "stu") {
			(*s)[len(*s)-1].MaritalStatus = "student"
		}
		return nil
	},
	"profession": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].Profession = d
		return nil
	},
	"email": func(s *[]openapi.UserData, data string) error {
		d := strings.ToLower(strings.TrimSpace(data))
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].Email = d
		return nil
	},
	"cellnumber": func(s *[]openapi.UserData, data string) error {
		d := strings.ToLower(strings.TrimSpace(data))
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].Mobile = d
		return nil
	},
	"relationwiththeprimaryapplicant": func(s *[]openapi.UserData, data string) error {
		d := strings.ToLower(strings.TrimSpace(data))
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		if strings.HasPrefix(d, "son") || strings.HasPrefix(d, "dau") {
			(*s)[len(*s)-1].Relation = "child"
		} else if strings.HasPrefix(d, "fat") || strings.HasPrefix(d, "mot") {
			(*s)[len(*s)-1].Relation = "parent"
		} else if strings.HasPrefix(d, "gran") {
			(*s)[len(*s)-1].Relation = "grandParent"
		} else if strings.HasPrefix(d, "sis") || strings.HasPrefix(d, "bro") {
			(*s)[len(*s)-1].Relation = "sibling"
		}
		return nil
	},
	"homeparish": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].HomeParish = d
		return nil
	},
	"dioceseinindia": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].DioceseInIndia = d
		return nil
	},
	"previousparishincanada(ifany)": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].PreviousParishInCanada = d
		return nil
	},
	"apt/unit#": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].Apartment = d
		return nil
	},
	"street#": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		currentInfo := (*s)[len(*s)-1].Street
		if len(currentInfo) == 0 {
			(*s)[len(*s)-1].Street = d
		} else {
			(*s)[len(*s)-1].Street = fmt.Sprintf("%s %s", d, (*s)[len(*s)-1].Street)
		}
		return nil
	},
	"streetname": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		currentInfo := (*s)[len(*s)-1].Street
		if len(currentInfo) == 0 {
			(*s)[len(*s)-1].Street = d
		} else {
			(*s)[len(*s)-1].Street = fmt.Sprintf("%s %s", (*s)[len(*s)-1].Street, d)
		}
		return nil
	},
	"city": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		(*s)[len(*s)-1].City = d
		return nil
	},
	"province": func(s *[]openapi.UserData, data string) error {
		d := strings.ToUpper(strings.TrimSpace(data))
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		if strings.HasPrefix(d, "NO") || strings.HasPrefix(d, "NS") {
			(*s)[len(*s)-1].Province = "NS"
		} else if len(d) == 2 {
			(*s)[len(*s)-1].Province = d
		}
		return nil
	},
	"postalcode": func(s *[]openapi.UserData, data string) error {
		d := strings.TrimSpace(data)
		if len(*s) == 0 || len(d) == 0 {
			return nil
		}
		if len(d) > 5 && len(d) < 8 {
			(*s)[len(*s)-1].PostalCode = d
		}
		return nil
	},
}

func parseDate(d string) (*string, error) {
	timeT, err := time.Parse("01/02/2006", d)
	if err != nil {
		return nil, err
	}
	formatted := timeT.Format(time.RubyDate)
	return &formatted, nil
}
func ProcessRecord(headers []string, rec []string) {
	var recs []openapi.UserData
	for i := range headers {
		header := strings.ToLower(strings.ReplaceAll(headers[i], " ", ""))
		fmt.Println(header)
		handler, exists := handlers[header]
		if !exists {
			continue
		}
		err := handler(&recs, rec[i])
		if err != nil {
			log.Fatal(err)
		}
	}
	fmt.Println(recs)
}
