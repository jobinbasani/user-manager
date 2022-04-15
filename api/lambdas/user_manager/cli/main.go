package main

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/urfave/cli/v2"
)

func main() {

	app := &cli.App{
		Name:        "User Manager CLI",
		Description: "Tools for managing video streams",
		Commands: []*cli.Command{
			newGetUserInfoCommand(),
			newGetUserInfoBySubCommand(),
			newGetUserInfoByEmailCommand(),
		},
		ErrWriter: os.Stderr,
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
