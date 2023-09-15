import {
    Alert,
    AlertIcon,
    Avatar,
    Button,
    Container,
    Flex,
    HStack,
    Heading,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    VStack,
    useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Resource } from "../interface/Resource";
import { User } from "../interface/User";
import { fetchResources } from "../utils/fetchResources";
import { fetchUsers } from "../utils/fetchUsers";
import "./App.css";
import { Home } from "./Home";
import { SubmitResource } from "./SubmitResource";
import { ToStudy } from "./ToStudy";
import { UserLogin } from "./UserLogin";
import { fetchFavourites } from "../utils/fetchFavourites";
import { fetchUserName } from "../utils/fetchUserName";
import { fetchImage } from "../utils/fetchImage";

function App() {
    const initialUser = JSON.stringify({
        user_name: "",
        user_id: 0,
        is_faculty: false,
    });

    const localUser = localStorage.getItem("activeUser");

    const { colorMode, toggleColorMode } = useColorMode();
    const [listedUsers, setListedUsers] = useState<User[]>([]);
    const [activeUser, setActiveUser] = useState<User>(
        JSON.parse(localUser ?? initialUser)
    );
    const [resources, setResources] = useState<Resource[]>([]);
    const [favourites, setFavourites] = useState<Resource[]>([]);
    const [selectedResource, setSelectedResource] = useState<Resource>();
    const [usernames, setUsernames] = useState<{ [key: number]: string }>({});
    const [linkPreviews, setLinkPreviews] = useState<{ [key: number]: string }>(
        {}
    );

    useEffect(() => {
        fetchUsers().then((users) => setListedUsers(users));
        fetchResources().then((res) => setResources(res));
    }, []);

    useEffect(() => {
        for (const r of resources) {
            fetchUserName(r.user_id).then((name) => {
                setUsernames((prev) => ({ ...prev, ...{ [r.user_id]: name } }));
            });

            fetchImage(r.url).then((img) => {
                setLinkPreviews((prev) => ({
                    ...prev,
                    ...{ [r.resource_id]: img },
                }));
            });
        }
    }, [resources]);

    useEffect(() => {
        if (!localUser) {
            localStorage.setItem("activeUser", initialUser);
        }
        localStorage.setItem("activeUser", JSON.stringify(activeUser));

        if (activeUser.user_id > 0) {
            fetchFavourites(activeUser.user_id).then((fav) =>
                setFavourites(fav)
            );
        }
    }, [localUser, initialUser, activeUser]);

    return (
        <div className="App">
            <Flex direction={"column"}>
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
                                                setActiveUser(
                                                    JSON.parse(initialUser)
                                                )
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

                <Router>
                    <VStack>
                        <nav>
                            <HStack>
                                <Link to="/home">
                                    <Button>Home</Button>
                                </Link>

                                <Link to="/study">
                                    <Button>Your Study Resources</Button>
                                </Link>

                                <Link to="/users">
                                    <Button>Users</Button>
                                </Link>

                                <Link to="/submit">
                                    {" "}
                                    <Button>Submit New</Button>
                                </Link>
                            </HStack>
                        </nav>

                        <Switch>
                            <Route path="/home">
                                <Home
                                    resources={resources}
                                    setResources={setResources}
                                    selectedResource={selectedResource}
                                    setSelectedResource={setSelectedResource}
                                    usernames={usernames}
                                    linkPreviews={linkPreviews}
                                    activeUser={activeUser}
                                    setFavourites={setFavourites}
                                />
                            </Route>
                            <Route path="/users">
                                <UserLogin
                                    listedUsers={listedUsers}
                                    setActiveUser={setActiveUser}
                                />
                            </Route>
                            <Route path="/study">
                                <ToStudy
                                    favourites={favourites}
                                    setSelectedResource={setSelectedResource}
                                    usernames={usernames}
                                    linkPreviews={linkPreviews}
                                    setResources={setResources}
                                    selectedResource={selectedResource}
                                    activeUser={activeUser}
                                    setFavourites={setFavourites}
                                />
                            </Route>
                            <Route path="/submit">
                                {activeUser.user_id > 0 ? (
                                    <SubmitResource
                                        activeUser={activeUser}
                                        setResources={setResources}
                                    />
                                ) : (
                                    <>
                                        {" "}
                                        <Container>
                                            <Alert status="warning">
                                                <AlertIcon />
                                                You must login before you can
                                                submit a new resource!
                                            </Alert>{" "}
                                        </Container>
                                        <UserLogin
                                            listedUsers={listedUsers}
                                            setActiveUser={setActiveUser}
                                        />{" "}
                                    </>
                                )}
                            </Route>
                        </Switch>
                    </VStack>
                </Router>
            </Flex>
        </div>
    );
}

export default App;
