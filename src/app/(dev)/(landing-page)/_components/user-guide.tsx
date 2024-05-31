'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/data-display/accordion";
import MediaLightBox from "@/components/media-light-box/media-light-box";
import { cn } from "@/utils/cn";
import Image from "next/image";
 
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

interface FAQ {
    id: string;
    title: string;
    content: React.ReactNode;
}
export default function UserGuide() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [index, setIndex] = useState<number | undefined>()
    const [imagePreview, setImagePreview] = useState<string | undefined>()

    const [guide, setGuide] = useState<{
        guide: string;
        guide_1: string;
        guide_2: string;
    }>({
        guide: '',
        guide_1: '',
        guide_2: '',
    })
    const onChangeAccordion = (value:string, level: 0 | 1 | 2) => {
        if(!searchParams || !router) return;
        const currentGuide = {...guide};
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        const param : 'guide' | 'guide_1' | 'guide_2' = level === 0 ? "guide" : `guide_${level}`;
        if (!value) {
            currentGuide[param] = '';
        } else {
            currentGuide[param] = value;
        }
        for (let i = level + 1; i < 3; i++) {
            const p = i === 0 ? "guide" : `guide_${i}`;
            //@ts-ignore
            currentGuide[p] = '';
            current.delete(p);
        }
        
        setGuide(currentGuide);
        let url = pathname + '?';
        for (const [key, value] of Object.entries(currentGuide)) {
            if (value) {
                url += `${key}=${value}&`;
            }
        }
        window.history.pushState({ path: url }, '', url);

        // let className = param + value;
    }

    const onPreviewImage = (url: string) => {
        setImagePreview(url);
        setIndex(0);
    }

    const guides = [
        {
            id: 'what-is-middo',
            title: "What is Middo?",
            content: <WhatIsMiddo />
        },
        {
            id: 'what-is-esl-translation',
            title: "What is E.S.L translation?",
            content: <WhatIsESLTranslation />
        },
        {
            id: 'how-to-use-translation',
            title: "How to use Translation",
            content: <MultiAccordion
            onPreviewImage={onPreviewImage}
            guide={guide}
            onChangeAccordion={onChangeAccordion}
            data={[
                {
                    id: 'source',
                    title: "Source",
                    header: <p><span className="font-semibold">Source</span> is the left-side text box in Translation page where you can input your text which need to be translated at there</p>,
                    image: "/landing-page/1.a.png",
                    subItems: [
                        {
                            id: 'select-language-bar',
                            title: "Select Language bar",
                            content: "It will display the language you have recently selected to help you change the translation language quickly"
                        },
                        {
                            id: 'source-language',
                            title: "Source language",
                            content: "The original language of the text you need to translate"
                        },
                        {
                            id: 'inputed-source',
                            title: "Inputed source",
                            content: "The text you need to translate"
                        },
                        {
                            id: 'esl-translated-from-source',
                            title: "E.S.L translated from source",
                            content: "The English translated text from your inputed source. Middo use it to compare with the E.S.L translated from target in order to give you the high accuracy translation. It will be display in 2 different colors, each means:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                <span className="font-semibold text-error-400-main">Red:</span> E.S.L source and E.S.L target are not matched
                                </li>
                                <li>
                                <span className="font-semibold text-success-700">Green:</span> E.S.L source and E.S.L target are not matched
                                </li>
                            </ul>
                        },
                        {
                            id: 'edit-esl-translation',
                            title: "Edit E.S.L translation",
                            content: "If the E.S.L translated not contains the correct means from your original text, you can edit to correct it."
                        },
                        {
                            id: 'text-to-speech',
                            title: "Text-to-Speech",
                            content: "Middo will read out loud what you have inputed"
                        },
                        {
                            id: 'copy-text',
                            title: "Copy text",
                            content: "Copy the text you have inputed"
                        }
                    ]
                },
                {
                    id: 'target',
                    title: "Target",
                    header: <p><span className="font-semibold">Target</span> is the right-side text box in Translation page where your translated text was placed</p>,
                    image: "/landing-page/1.b.png",
                    subItems: [
                        {
                            id: 'show-the-list-of-supported-language',
                            title: "Show the list of supported language",
                            content: "Click this button to open the list of supported language"
                        },
                        {
                            id: 'target-language',
                            title: "Target language",
                            content: "The language you want to translate your text"
                        },
                        {
                            id: 'target-text',
                            title: "Target text",
                            content: "The content of your translation"
                        },
                        {
                            id: 'esl-translated-from-target',
                            title: "E.S.L translated from target",
                            content: "The English translated text from your target text. Middo use it to compare with the E.S.L translated from source in order to give you the high accuracy translation. It will be display in 2 different colors, each means:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                <span className="font-semibold text-error-400-main">Red:</span> E.S.L source and E.S.L target are not matched
                                </li>
                                <li>
                                <span className="font-semibold text-success-700">Green:</span> E.S.L source and E.S.L target are not matched
                                </li>
                            </ul>
                        },
                        {
                            id: 'confirm-esl-translation',
                            title: "Confirm E.S.L translation",
                            content: "IWhen E.S.Ls are not matched, this button will be shown up. Click it if you think the difference between the source and target E.S.L translated text is acceptable and usable. Until the green E.S.L show up, you can use other advance features."
                        },
                        {
                            id: 'text-to-speech',
                            title: "Text-to-Speech",
                            content: "Middo will read out loud what you have inputed"
                        },
                        {
                            id: 'copy-text',
                            title: "Copy text",
                            content: "Copy the text you have inputed"
                        }
                    ]
                },
                {
                    id: 'advance-features',
                    title: "Advance Features",
                    header: <p>Advance Features</p>,
                    image: "/landing-page/1.c.png",
                    subItems: [
                        {
                            id: 'history',
                            title: "History",
                            content: "Click this button to open the history of your translation"
                        },
                        {
                            id: 'phrases',
                            title: "Phrases",
                            content: "Phrases contain more than 100 sample sentences for you to use in under any specific circumstances"
                        },
                        {
                            id: 'copy-all-text',
                            title: "Copy all text",
                            content: "Click this button to copy: Source text & Target text & E.S.L translated from source text. Only works when meets:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Source & Target language are not in English
                                </li>
                                <li>
                                E.S.L source and E.S.L target is green
                                </li>
                            </ul>
                        },
                        {
                            id: 'speech-to-text',
                            title: "Speech-to-Text",
                            content: "Use your voice as the keyboard input.",
                            subContent: <span className="text-sm font-light italic">*Note: This button is not working on Auto Detect Language mode</span>
                        },
                        {
                            id: 'take-screenshot',
                            title: "Take screenshot",
                            content: "Click this button to quickly take the screenshot of the translation you made to share with anyone. Only works when meets:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Source & Target language are not in English
                                </li>
                                <li>
                                E.S.L source and E.S.L target is green
                                </li>
                            </ul>
                        }
                    ]
                }
            ]}/>
        },
        {
            id: 'how-to-use-conversation',
            title: "How to use Conversation?",
            content: <MultiAccordion 
                onPreviewImage={onPreviewImage}
                guide={guide}
                onChangeAccordion={onChangeAccordion}
                data={[
                {
                    id: 'conversation-list',
                    title: "Conversation list",
                    image: "/landing-page/2.a.png",
                    subItems: [
                        {
                            id: 'new-message-button',
                            title: "New message button",
                            content: "Click this button to create a Personal conversation or Group conversation"
                        },
                        {
                            id: 'conversation-settings',
                            title: "Conversation’s settings",
                            content: "Click this button to toggle:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Translation tool
                                </li>
                                <li>
                                E.S.L translated messages
                                </li>
                            </ul>
                        },
                        {
                            id: 'search-bar',
                            title: "Search bar",
                            content: "Enter username, person’s name or group’s name to search"
                        },
                        {
                            id: 'conversation-tabs',
                            title: "Conversation’s tabs",
                            content: "Contains all type of conversations",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Group: contains only group type conversations
                                </li>
                                <li>
                                Archive: contains only archived conversations
                                </li>
                                <li>
                                Waiting: contains only un-know user’s conversations.
                                </li>
                            </ul>
                        },
                        {
                            id: 'avatar-name-message',
                            title: "Avatar / Name / Message",
                            content: "The representative image of a person or a group",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Name: the Person’s name or Group’s name
                                </li>
                                <li>
                                Message: Content of the last message of the conversation
                                </li>
                            </ul>
                        },
                        {
                            id: 'notification-off-icon',
                            title: "Notification-off icon",
                            content: "This icon will be shown whenever the conversation’s notification is turned off by you"
                        },
                        {
                            id: 'pin-conversation-icon',
                            title: "Pin conversation icon",
                            content: "This icon will be shown whenever you pinned any conversations to top"
                        }
                    ]
                },
                {
                    id: 'message-box',
                    title: "Message box",
                    image: "/landing-page/2.b.png",
                    subItems: [
                        {
                            id: 'online-status',
                            title: "Online status",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                <span className="text-neutral-500 font-semibold">Grey:</span> This user or every users in this group is not using Middo currently
                                </li>
                                <li>
                                <span className="text-success-700 font-semibold">Green</span>: This user or every users in this group is using Middo currently
                                </li>
                            </ul>
                        },
                        {
                            id: 'start-middo-call',
                            title: "Start Middo Call",
                            content: "Click this button to start a call with a person or group"
                        },
                        {
                            id: 'show-conversation-information',
                            title: "Show conversation information",
                            content: "Click this button to show the information of any conversation"
                        },
                        {
                            id: 'timestamp',
                            title: "Timestamp",
                            content: "Every 10 minutes, a timestamp will be shown to let you know when was this conversation’s section was started"
                        },
                        {
                            id: 'message-item',
                            title: "Message item",
                            content: "It contains the message, E.S.L translated message, and other status"
                        },
                        {
                            id: 'input-message-box',
                            title: "Input message box",
                            content: "The place where you input your message and other tools"
                        }
                    ]
                },
                {
                    id: "message-item",
                    image: "/landing-page/2.c.png",
                    title: "Message item",
                    subItems: [
                        {
                            id: 'edit-status',
                            title: "Edit status",
                            content: "This status only appears whenever a message is edited by someone"
                        },
                        {
                            id: 'message-content',
                            title: "Message content",
                            content: "Message content will only be translated for receiver"
                        },
                        {
                            id: 'esl-translated-message',
                            title: "E.S.L translated message",
                            content: "The English translated text from your message content"
                        },
                        {
                            id: 'message-informations',
                            title: "Message’s informations",
                            content: "Whenever you click a message item, message’s informations will be shown. It will contains:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Which language the message was translated from
                                </li>
                                <li>
                                Timestamp of this message
                                </li>
                            </ul>
                        },
                        {
                            id: 'pinned-status',
                            title: "Pinned status",
                            content: "This status only appears whenever a message is pinned by someone"
                        },
                        {
                            id: 'reply-status',
                            title: "Reply status",
                            content: "This status only appears whenever a message had “Reply in Discussion”"
                        },
                        {
                            id: 'emoji-status',
                            title: "Emoji status",
                            content: "This status only appears whenever a message had emoji reaction by someone"
                        },
                        {
                            id: 'seen-status',
                            title: "Seen status",
                            content: "This status only appears whenever a message is seen by other"
                        }
                    ]
                },
                {
                    id: 'input-message-box',
                    title: "Input message box",
                    image: "/landing-page/2.d.png",
                    subItems: [
                        {
                            id: 'toggle-esl-translation-tool',
                            title: "Toggle E.S.L translation tool",
                            content: "Toggle to turn on/of E.S.L translation tool"
                        },
                        {
                            id: 'esl-translation-tool',
                            title: "E.S.L translation tool",
                            content: "Translate your message content into English to ensure the accuracy of translation"
                        },
                        {
                            id: 'edit-esl-translation',
                            title: "Edit E.S.L translated text",
                            content: "If the E.S.L translated not contains the correct means from your original text, you can edit to correct it."
                        },
                        {
                            id: 'input-tools',
                            title: "Input tools",
                            content: "It will contains:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>Send images / videos / files</li>
                                <li>Send emoji</li>
                                <li>Speech-to-text</li>
                                <li>Mention (only works in Group’s conversation)</li>
                            </ul>
                        },
                        {
                            id: 'input-text',
                            title: "Input text",
                            content: "Place to input you message content"
                        },
                        {
                            id: 'send',
                            title: "Send",
                            content: "Only appears whenever input message box has content"
                        }
                    ]
                },
                {
                    id: 'discussion',
                    title: "Discussion",
                    image: "/landing-page/2.e.png",
                    subItems: [
                        {
                            id: 'what-is-discussion',
                            title: "What is Discussion",
                            content: "Whenever someone replies to your message. Discussion will be created"
                        },
                        {
                            id: 'notification-in-discussion',
                            title: "Notification in Discussion",
                            content: "You would have notifications in Discussion, whenever you relative to this Discussion:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                If you&apos;re mentioned in any message of Discussion
                                </li>
                                <li>
                                If you replies in a Discussion
                                </li>
                            </ul>
                        }

                    ]

                },
                {
                    id: "middo-call-minimize-mode",
                    title: "Middo Call (Minimize mode)",
                    image: "/landing-page/2.f.png",
                    subItems: [
                        {
                            id: 'change-to-maximize-mode',
                            title: "Change to Maximize mode",
                            content: "Click this button to maximize the Middo Call screen"
                        },
                        {
                            id: 'add-member-to-join-call',
                            title: "Add member to join call",
                            content: "When a Middo Call is started, only invited-to-join member receive the calling notification screen."
                        },
                        {
                            id: 'microphone-status',
                            title: "Microphone status",
                            content: "This status to represent for who is turn on or off their microphone."
                        },
                        {
                            id: 'middo-call-tools',
                            title: "Middo Call tools",
                            content: "In minimize mode, there are 4 default tools to use:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Share screen
                                </li>
                                <li>
                                Turn on/off camera
                                </li>
                                <li>
                                Turn on/off microphone
                                </li>
                                <li>
                                Leave call
                                </li>
                            </ul>
                        }
                    ]
                },
                {
                    id: "middo-call-maximize-mode",
                    title: "Middo Call (Maximize mode)",
                    image: "/landing-page/2.g.png",
                    subItems: [
                        {
                            id: 'change-to-minimize-mode',
                            title: "Change to Minimize mode",
                            content: "Click this button to minimize the Middo Call screen"
                        },
                        {
                            id: 'discussion',
                            title: "Discussion",
                            content: "When a Middo Call is started, a discussion is auto generated to save all of your messages through Middo Call"
                        },
                        {
                            id: 'share-screen-tools',
                            title: "Share screen tools",
                            content: "Whenever you start sharing your screen, a tool box will be displayed at top to help you represent your screen:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Doodle: allows you to draw on your screen. The drew line will auto disappear after a few seconds
                                </li>
                                <li>
                                Turn on/off microphone
                                </li>
                                <li>
                                Turn on/off camera
                                </li>
                                <li>
                                Stop sharing screen
                                </li>
                            </ul>
                        },
                        {
                            id: 'advance-middo-call-tools',
                            title: "Advance Middo Call tools",
                            content: "In maximize mode, there are 4 advance tools to use:",
                            subContent: <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                <li>
                                Gallery view
                                </li>
                                <li>
                                Screen capture (Only work when sharing screen happens): Quickly take a screenshot of the shared screen, all member join this call could draw on it
                                </li>
                                <li>
                                Caption: Speech-to-Text all member voice, and auto translate to the receiver’s native language
                                </li>
                                <li>
                                Video and audio settings
                                </li>
                            </ul>
                        }
                    ]
                }
            ]}/>
        },
        {
            id: 'how-to-embed-conversation-to-your-website',
            title: "How to embed Conversation to your website?",
            content: <MultiStepAccordion 
            onPreviewImage={onPreviewImage}
            steps={[
                {
                    id: 'step-1-create-a-space',
                    title: 'Step 1: Create a Space',
                    items: [
                        {
                            content: <p>1. Go to <a href="https://middo.app/spaces" target="_blank">https://middo.app/spaces</a></p>,
                            image: "/landing-page/3.a.png"
                        },
                        {
                            content: <p>2. Click “Create New Space”: Then give your space name, avatar, and add members</p>,
                            image: "/landing-page/3.b.png"
                        }
                    ]
                },
                {
                    id: 'step-2-create-your-extension',
                    title: 'Step 2: Create your Extension',
                    items: [
                        {
                            content: <p>1. Go to “Settings” page. Move to “Conversation Extension&quot; tab</p>,
                            image: "/landing-page/3.c.png"
                        },
                        {
                            content: <p>2. Click “Create Extension” and set up your extension</p>,
                            image: "/landing-page/3.d.png"
                        },
                        {
                            content: <p>3.1. Set up your domain (the list of public sites that you allow your Conversation Extension to appear on)</p>,
                            image: "/landing-page/3.e.png"
                        },
                        {
                            content: <div>
                                <p>3.2. Set up your starting message. There&apos;re 3 options:</p>
                                <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                    <li><span className="font-semibold">Default:</span> a default message to greet and guide users</li>
                                    <li><span className="font-semibold">Custom:</span> write your own greeting message</li>
                                    <li><span className="font-semibold">Scripted conversation:</span> Choose available script or create your new script</li>
                                </ul>
                            </div>,
                            image: "/landing-page/3.f.png"
                        },
                        {
                            content: <p>3.3. Custom your Extension. You can choose: Theme, Conversation icon, and other options</p>,
                            image: "/landing-page/3.g.png"
                        },
                        {
                            content: <p>4. Copy embed code: After created Conversation Extension, you can copy your embed code on your setting page</p>,
                            image: "/landing-page/3.h.png"
                        },
                    ]
                },
                {
                    id: 'step-3-paste-the-embed-code-to-your-website',
                    title: "Step 3: Paste the embed code to your website",
                    content: <>
                        <p>Adding the embed code to your website may vary depending on the type of website platform you are using. Here are some basic instructions for some popular platforms:</p>
                        <ContentMultiStep 
                            guide={guide}
                            steps={[
                                {
                                    id: "embed-into-the-html-source-code-of-your-website",
                                    title: "Embedding into the HTML source code of your website:",
                                    content: <div>
                                        <p>If you have access to the HTML source code of your website, you can directly paste the embed code there. For example:</p>
                                        <div className="w-full mt-2">
                                            <Image onClick={()=>onPreviewImage('/landing-page/3.i.png')} src="/landing-page/3.i.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                        </div>
                                    </div>
                                },
                                {
                                    id: "using-content-management-systems",
                                    title: "Using Content Management Systems (CMS): ",
                                    content: <div>
                                        <p>If you&apos;re using WordPress, you can add the embed code:</p>
                                        <p>a. Access your WordPress (<a href="https://wordpress.com/login" target="_blank">https://wordpress.com/login</a>)</p>
                                        <p>b. Adding an embed:</p>
                                        <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                            <li>
                                                <span>Click on “Pages”</span>
                                                <div className="w-full mt-2">
                                                    <Image onClick={()=>onPreviewImage('/landing-page/3.j.png')} src="/landing-page/3.j.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                                </div>
                                            </li>
                                            <li>
                                                <span>Click on the page you want your chat, or click on &quot;Add new page”</span>
                                                <div className="w-full mt-2">
                                                    <Image onClick={()=>onPreviewImage('/landing-page/3.k.png')} src="/landing-page/3.k.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                                </div>
                                            </li>

                                        </ul>
                                        <p>c. Setting up an embed:</p>
                                        <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
                                            <li>
                                                <span>Click on the &quot;+&quot; icon.</span>
                                                <div className="w-full mt-2">
                                                    <Image onClick={()=>onPreviewImage('/landing-page/3.l.png')} src="/landing-page/3.l.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                                </div>
                                            </li>
                                            <li>
                                                <span>Search for &quot;Custom HTML&quot; and click it</span>
                                                <div className="w-full mt-2">
                                                    <Image onClick={()=>onPreviewImage('/landing-page/3.m.png')} src="/landing-page/3.m.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                                </div>
                                            </li>
                                            <li>
                                                <span>Paste your Code inside the HTML block. </span>
                                                <div className="w-full mt-2">
                                                    <Image onClick={()=>onPreviewImage('/landing-page/3.n.png')} src="/landing-page/3.n.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                                </div>
                                            </li>
                                        </ul>
                                        <p>d. Save your change:</p>
                                    </div>
                                },
                                {
                                    id: "contacting-your-website-administrator",
                                    title: "Contacting your website administrator",
                                    content: <p>You can contact your website administrator or developer if you cannot add the embed code. Please provide them with the embed code and instructions to add it to your website.</p>
                                }
                            ]}
                            onChangeAccordion={onChangeAccordion}
                        />
                    </>
                }
            ]}
            onChangeAccordion={onChangeAccordion}
            guide={guide}/>
        },
        {
            id: 'how-to-manage-your-script-conversation',
            title: "How to manage your Script Conversation?",
            content: <MultiStepAccordion 
            onPreviewImage={onPreviewImage}
            guide={guide}
            paragraph={<p>Script Conversation guides for representatives to get the ball rolling in conversations. But Script Conversation can also double up as proactive messages in high-performing pages. You can use these messages to start conversations with website visitors even before they reach out to you.</p>}
            steps={[
                {
                    id: 'step-1-see-your-scripts-from-the-scripts-management-page',
                    title: "See your scripts from the “Scripts Management” page",
                    items: [
                        {
                            content: <p>This page only available for Admin and Space’s owner</p>,
                            image: "/landing-page/4.a.png"
                        }
                    ]
                },
                {
                    id: 'step-2-create-your-script',
                    title: "Create your Script",
                    items: [
                        {
                            content: <p>1. Go to “Scripts Management” page</p>,
                            image: "/landing-page/4.b.png"
                        },
                        {
                            content: <p>2. Click on the “Add New Script” button</p>,
                            image: "/landing-page/4.c.png"
                        },
                        {
                            content: <div>
                                <p>3. Enter the script name and design your own Script</p>
                                <p className="mt-1">Preview your script by clicking the “Preview” button: it’ll open a new fake embed chat for you to test it out.</p>
                            </div>,
                            image: "/landing-page/4.d.png"
                        }
                    ]
                }
            ]}
            onChangeAccordion={onChangeAccordion}/>
        },
        {
            id: 'why-i-can-not-reply-to-a-conversation',
            title: "Why I can NOT reply to a conversation?",
            content: <WhyCanNotReplyConversation onPreviewImage={onPreviewImage}/>
        }
    ]


    useEffect(()=> {
        if(!searchParams) return;
        let accordion: any
        let data = {
            guide: '',
            guide_1: '',
            guide_2: '',
        };
        data.guide_2 = searchParams.get('guide_2') || '';
        data.guide_1 = searchParams.get('guide_1') || '';
        data.guide = searchParams.get('guide') || '';
        if(searchParams.get('guide_2')) {
            accordion = `guide_2${searchParams.get('guide_2')}`;
        } else if(searchParams.get('guide_1')) {
            accordion = `guide_1${searchParams.get('guide_1')}`;
        } else if(searchParams.get('guide')) {
            accordion = `guide${searchParams.get('guide')}`;
        }
        setGuide(data);
        setTimeout(()=>{
            if(accordion) {
                const el = document.querySelector(`.${accordion}`);
                if(el) {
                    window.scrollTo({
                        top: el.getBoundingClientRect().top - 52,
                        behavior: 'smooth'
                    });
                }
            }
        }, 500)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return  <>
    <Accordion type="single" collapsible className="flex flex-col gap-5"
        value={guide.guide}
        onValueChange={(val: string)=>onChangeAccordion(val, 0)}>
        {guides.map(guide => (
            <AccordionItem key={guide.id} value={guide.id} id={'guide' + guide.id}>
                <AccordionTrigger 
                className={cn('rounded-xl bg-[#fafafa] px-5 text-base md:text-xl hover:no-underline text-left ', 'guide' + guide.id)}>
                    {guide.title}
                </AccordionTrigger>
                <AccordionContent className="px-5 py-5 text-base">
                    {guide.content}
                </AccordionContent>
            </AccordionItem>
        ))}
  </Accordion>
    <MediaLightBox  
        index={index} 
        close={()=>{
            setIndex(undefined)
        }}
        files={[
            {
                url: imagePreview || '',
                type: "image"
            }
        ]}
    />
    </>
}

const WhatIsMiddo = () => {
    return <>
        <span className="font-semibold text-primary-500-main">Middo</span>{' '}is your ultimate companion for seamless communication across languages. With <span className="font-semibold text-primary-500-main">Middo</span> , you can translate web pages effortlessly, and engage in real-time conversations with anyone, anywhere. Break down language barriers and connect with people from all around the globe like never before. <br></br>
        <p className="py-3">Key Features:</p>
        <ul className="flex list-disc flex-col gap-3 pl-3">
          <li>
            <span className="font-semibold">Translation:</span> Middo&apos;s powerful translation engine ensures that you can access and understand content in any language instantly.
          </li>
          <li>
            <span className="font-semibold">Real-time Conversation:</span>{' '} Chat with friends, family, or colleagues in real-time, regardless of their language. Middo automatically translates messages, allowing for smooth and natural conversations.
          </li>
          <li>
            <span className="font-semibold">Auto-Translate Messages: </span>{' '} Say goodbye to language confusion. Middo automatically detects the language of incoming messages and translates them into your preferred language, making communication effortless.
          </li>
          <li>
            <span className="font-semibold">Multi-Language Support:</span> Speak and be understood in over 100 languages. Middo covers a wide range of languages, ensuring that you can communicate effectively with people from diverse backgrounds.
          </li>
          <li>
            <span className="font-semibold">User-friendly Interface: </span> Middo&apos;s intuitive interface makes it easy for anyone to navigate and use the app. Whether you&apos;re a seasoned traveler or a casual user, Middo provides a seamless experience
          </li>
        </ul>
    </>
}

const WhatIsESLTranslation = () => {
    return <p>
        <span className="font-semibold text-primary-500-main">E.S.L</span> stands for <span className="font-semibold">   English as a Second Language </span> . This is the term used to refer to learning English for people who have another mother tongue.
    </p>
}

const WhyCanNotReplyConversation = ({onPreviewImage}: {
    onPreviewImage: (image: string) => void
}) => {
    return <div>
        <p>Sometimes, you will can NOT reply to a conversation if</p>
        <ul className="ml-5 mt-5 flex list-disc flex-col gap-3">
            <li><span className="font-semibold">In Conversation page:</span> You’re blocked by a user</li>
            <li><span className="font-semibold">In Extension page:</span> The user you want to send message has left the conversation, or this conversation is timed out</li>
        </ul>
        <div className="w-full mt-2">
            <Image onClick={()=>onPreviewImage('/landing-page/5.a.png')} src="/landing-page/5.a.png" alt="" width={1000} height={500} className="block mx-auto w-full"/>
        </div>
    </div>
}

interface SubItem {
    id: string;
    title: string;
    content?: React.ReactNode;
    subItems?: SubItem[];
    subContent?: React.ReactNode;
}
interface MultiAccordion {
    id: string;
    title: string;
    header?: React.ReactNode;
    image: string;
    subItems: SubItem[]
}
interface MultiAccordionProps {
    data: MultiAccordion[];
    onChangeAccordion: (value: string, level: 0 | 1 | 2) => void;
    onPreviewImage: (image: string) => void;
    guide: {
        guide: string;
        guide_1: string;
        guide_2: string;
    };
}

const MultiAccordion = ({data, onChangeAccordion, guide, onPreviewImage} : MultiAccordionProps) => {
    return <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-3"
          value={guide.guide_1 || ''}
          onValueChange={(value: string) => onChangeAccordion(value, 1)}
        >
        {data.map((item) => {
            return <AccordionItem value={item.id} key={item.id} id={'guide_1' + item.id}>
                <AccordionTrigger 
                className={cn('rounded-xl bg-primary-100 px-5 text-base md:text-lg hover:no-underline text-left',
                    'guide_1' + item.id
                )}>
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="px-2 py-5 text-base">
                    {item?.header}
                    <div className="mt-5 flex justify-start gap-10 flex-col md:flex-row">
                        <div className="md:w-1/2">
                            <Image onClick={()=>onPreviewImage(item.image)} src={item.image} alt="" width={500} height={500} />
                        </div>
                        <div className="flex md:w-1/2 flex-col gap-3">
                            <Accordion
                                type="single"
                                collapsible
                                className="flex flex-col gap-3"
                                value={guide.guide_2}
                                onValueChange={(value: string) => onChangeAccordion(value, 2)}
                            >
                                {item.subItems.map((subItem, index) => {
                                    return <AccordionItem value={subItem.id} key={subItem.id}>
                                        <AccordionTrigger 
                                        className={cn('rounded-xl border border-neutral-50 bg-white px-5 hover:no-underline text-left', 'guide_2' + subItem.id)}>
                                            {index + 1} . {subItem.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-2 py-2 text-base">
                                            {subItem.content}
                                            <br />
                                            {subItem.subContent}
                                        </AccordionContent>
                                    </AccordionItem>
                                })}
                            </Accordion>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        })}
    </Accordion>
}

interface MultiStepAccordion {
    paragraph?: React.ReactNode,
    steps: {
        id: string,
        title: string,
        items?: {
            content: React.ReactNode,
            image: string
        }[],
        content?: React.ReactNode
    }[],
    onChangeAccordion: (value: string, level: 0 | 1 | 2) => void;
    onPreviewImage: (image: string) => void;
    guide: {
        guide: string;
        guide_1: string;
        guide_2: string;
    };
}

const MultiStepAccordion = ({paragraph, steps, onChangeAccordion, onPreviewImage,  guide} : MultiStepAccordion) => {
    return <div>
        <div className="mb-5">
            {paragraph}
        </div>
        <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-3"
            value={guide.guide_1}
            onValueChange={(value: string) => onChangeAccordion(value, 1)}
        >
            {steps.map(step => {
                return <AccordionItem value={step.id} key={step.id}>
                        <AccordionTrigger 
                            className={cn('rounded-xl bg-primary-100 px-5 text-base md:text-lg hover:no-underline text-left',
                            'guide_1' + step.id)}
                        >
                            {step.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-2 py-2 text-base flex flex-col gap-4">
                            {
                                step?.items?.map(item => {
                                    return <div key={item.image}>
                                        {item.content}
                                        <div className="w-full mt-2">
                                            <Image onClick={()=>onPreviewImage(item.image)} src={item.image} alt="" width={1000} height={500} className="block mx-auto w-full"/>
                                        </div>
                                    </div>
                                })
                            }
                            {step.content}
                        </AccordionContent>
                    </AccordionItem>
            })}
        </Accordion>
        
    </div>
}


interface ContentMultiStepProps {
    steps: {
        id: string,
        title: string,
        content: React.ReactNode
    }[],
    onChangeAccordion: (value: string, level: 0 | 1 | 2) => void;
    guide: {
        guide: string;
        guide_1: string;
        guide_2: string;
    };
}
const ContentMultiStep = ({steps, onChangeAccordion, guide}: ContentMultiStepProps) => {
    return <>
        <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-3"
            value={guide.guide_2}
            onValueChange={(value: string) => onChangeAccordion(value, 2)}
        >
            {steps.map(step => {
                return <AccordionItem value={step.id} key={step.id}>
                        <AccordionTrigger 
                            className={cn('rounded-xl border border-neutral-50 bg-white px-5 hover:no-underline text-left',
                            'guide_2' + step.id)}
                        >
                            {step.title}
                        </AccordionTrigger>
                        <AccordionContent className="px-2 py-2 text-base flex flex-col gap-4">
                            {step.content}
                        </AccordionContent>
                    </AccordionItem>
            })}
        </Accordion>
    </>
}