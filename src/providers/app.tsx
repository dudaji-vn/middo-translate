import React from 'react';

type Props = {};

export const AppProvider = (props: Props & React.PropsWithChildren) => {
	return <>{props.children}</>;
};
