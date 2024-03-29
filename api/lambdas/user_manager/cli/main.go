package main

import (
	"lambdas/user_manager/cli/internal"
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/urfave/cli/v2"
)

func main() {

	app := &cli.App{
		Name:        "User Manager CLI",
		Description: "Tools for managing user manager data",
		Commands: []*cli.Command{
			internal.NewGetUserInfoCommand(),
			internal.NewGetUserInfoBySubCommand(),
			internal.NewGetUserInfoByEmailCommand(),
			internal.NewSearchUserCommand(),
			internal.NewStartServerCommand(),
			internal.NewLoadDataCommand(),
		},
		ErrWriter: os.Stderr,
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
