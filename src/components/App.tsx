import "./App.css";
import {
    useColorMode,
    Button,
    Container,
    HStack,
    VStack,
    Avatar,
    Flex,
    Heading,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { UserLogin } from "./UserLogin";
import { ToStudy } from "./ToStudy";
import { Home } from "./Home";
import { SubmitResource } from "./SubmitResource";
import { useEffect, useState } from "react";
import { User } from "../interface/User";
import axios from "axios";
import { baseUrl } from "../baseUrl";

function App() {
    const { colorMode, toggleColorMode } = useColorMode();
    const [listedUsers, setListedUsers] = useState<User[]>([]);
    const [activeUser, setActiveUser] = useState<User>();

    useEffect(() => {
        async function fetchUsers(): Promise<User[]> {
            const response = await axios.get(baseUrl + "/users");
            return response.data;
        }

        fetchUsers().then((users) => setListedUsers(users));
    }, []);

    return (
        <div className="App">
            <Flex direction={"column"} height={"100vh"}>
                <header>
                    <Flex
                        justify={"space-around"}
                        alignItems={"center"}
                        paddingTop={"2vh"}
                    >
                        <Button onClick={toggleColorMode}>
                            Toggle {colorMode === "light" ? "Dark" : "Light"}
                        </Button>
                        <Heading textAlign={"center"}>
                            Study Resources Catalog
                        </Heading>
                        <Popover>
                            <PopoverTrigger>
                                <Avatar
                                    src="https://bit.ly/broken-link"
                                    name={activeUser?.name}
                                />
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverHeader>
                                        Do you want to sign out?
                                    </PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <Button
                                            colorScheme="blue"
                                            onClick={() =>
                                                setActiveUser(undefined)
                                            }
                                        >
                                            <a href="/users">Sign Out</a>
                                        </Button>
                                    </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                    </Flex>
                </header>

                <Container>
                    <Router>
                        <VStack>
                            <nav>
                                <HStack>
                                    <Button>
                                        <Link to="/home">Home</Link>
                                    </Button>

                                    <Button>
                                        <Link to="/study">
                                            Your Study Resources
                                        </Link>
                                    </Button>

                                    <Button>
                                        <Link to="/users">Users</Link>
                                    </Button>

                                    <Button>
                                        <Link to="/submit">Submit New</Link>
                                    </Button>
                                </HStack>
                            </nav>

                            <Switch>
                                <Route path="/home">
                                    <Home />
                                </Route>
                                <Route path="/users">
                                    <UserLogin
                                        listedUsers={listedUsers}
                                        setActiveUser={setActiveUser}
                                    />
                                </Route>
                                <Route path="/study">
                                    <ToStudy />
                                </Route>
                                <Route path="/submit">
                                    <SubmitResource />
                                </Route>
                            </Switch>
                        </VStack>
                    </Router>
                </Container>
            </Flex>
        </div>
    );
}

export default App;
